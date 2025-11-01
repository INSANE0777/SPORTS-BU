import React, { useState, useMemo } from 'react';
import { useAuctionRealtime } from '@/hooks/useAuctionRealtime';
import { databases, functions } from '@/lib/appwrite';
import appwriteConfig from '@/config/appwrite';
import  PlayerCard  from "@/components/PlayerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, Gavel, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { HouseDocument } from '@/types/appwrite';
import { AppwriteException } from 'appwrite';

const Admin: React.FC = () => {
  const { players, houses, auctionState, isLoading } = useAuctionRealtime();
  
  const [manualBidAmount, setManualBidAmount] = useState("");
  const [selectedHouseForBid, setSelectedHouseForBid] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to schedule elite players after every 6-7 normal players
  const schedulePlayers = useMemo(() => {
    const normalPlayers = players.filter(p => !p.isSold && p.rating < 9);
    const elitePlayers = players.filter(p => !p.isSold && p.rating >= 9);
    
    const scheduled: typeof players = [];
    let normalIndex = 0;
    let eliteIndex = 0;
    let batchNumber = 0;
    
    // Pattern: 7 normal, elite, 6 normal, elite, 7 normal, elite, etc.
    while (normalIndex < normalPlayers.length || eliteIndex < elitePlayers.length) {
      // Determine batch size: alternate between 7 and 6
      const normalBatchSize = batchNumber % 2 === 0 ? 7 : 6;
      
      // Add batch of normal players
      for (let i = 0; i < normalBatchSize && normalIndex < normalPlayers.length; i++) {
        scheduled.push(normalPlayers[normalIndex]);
        normalIndex++;
      }
      
      // Add 1 elite player after the batch (if available)
      if (eliteIndex < elitePlayers.length) {
        scheduled.push(elitePlayers[eliteIndex]);
        eliteIndex++;
      }
      
      batchNumber++;
      
      // If no more elite players, add remaining normal players at the end
      if (eliteIndex >= elitePlayers.length && normalIndex < normalPlayers.length) {
        while (normalIndex < normalPlayers.length) {
          scheduled.push(normalPlayers[normalIndex]);
          normalIndex++;
        }
      }
    }
    
    return scheduled;
  }, [players]);
  
  const currentPlayer = players.find(p => p.$id === auctionState?.currentPlayerId);
  const winningHouse = houses.find(h => h.$id === auctionState?.winningHouseId);
  const unsoldPlayers = schedulePlayers; // Use scheduled order instead of filtered
  const currentUnsoldIndex = unsoldPlayers.findIndex(p => p.$id === currentPlayer?.$id);

  const handleResetAuction = async () => {
    if (!confirm("Are you sure you want to reset the auction? This will reset the auction state.")) return;
    
    setIsProcessing(true);
    try {
      // Get the first player from scheduled order
      const firstPlayer = schedulePlayers[0];
      
      if (!firstPlayer) {
        toast.error("No players available to start auction.");
        setIsProcessing(false);
        return;
      }
      
      // Reset auction state with the first scheduled player ready
      await databases.updateDocument(
        appwriteConfig.databaseId, 
        appwriteConfig.auctionStateTableId, 
        appwriteConfig.auctionStateDocId, 
        { 
          currentPlayerId: firstPlayer.$id,
          currentBid: firstPlayer.basePrice,
          winningHouseId: "",
          isAuctionActive: false, 
          statusMessage: "Ready"
        }
      );
      
      toast.success("Auction has been reset! Click 'Start' to begin.");
    } catch (error) {
      console.error("Failed to reset auction:", error);
      toast.error("Failed to reset auction");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartAuction = async () => {
    // If there's already a current player, just resume the auction for them
    if (currentPlayer) {
      await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.auctionStateTableId, appwriteConfig.auctionStateDocId, { 
        isAuctionActive: true, 
        statusMessage: "LIVE"
      });
      toast.success("Auction Resumed!");
      return;
    }
    
    // Otherwise, start with the first unsold player
    const playerToStart = unsoldPlayers[0];
    if (!playerToStart) return toast.error("All players have been auctioned.");
    await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.auctionStateTableId, appwriteConfig.auctionStateDocId, { 
      currentPlayerId: playerToStart.$id,
      currentBid: playerToStart.basePrice,
      winningHouseId: "",
      isAuctionActive: true, 
      statusMessage: "LIVE"
    });
    toast.success("Auction Started!");
  };

  const handlePauseAuction = async () => {
    await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.auctionStateTableId, appwriteConfig.auctionStateDocId, { isAuctionActive: false, statusMessage: "Paused" });
    toast.info("Auction Paused.");
  };

  const handleSkipPlayer = async () => {
    if (!currentPlayer || isProcessing) return;
    
    if (!confirm(`Are you sure you want to skip ${currentPlayer.name}?`)) return;
    
    setIsProcessing(true);
    try {
      // Find the current player's index in the unsold players list
      const currentIndex = unsoldPlayers.findIndex(p => p.$id === currentPlayer.$id);
      
      // Get the next player in the list (after current index)
      const nextPlayer = unsoldPlayers[currentIndex + 1];
      
      if (nextPlayer) {
        await databases.updateDocument(
          appwriteConfig.databaseId, 
          appwriteConfig.auctionStateTableId, 
          appwriteConfig.auctionStateDocId, 
          {
            currentPlayerId: nextPlayer.$id,
            currentBid: nextPlayer.basePrice,
            winningHouseId: "",
            isAuctionActive: false,
            statusMessage: "Skipped",
          }
        );
        toast.info(`Skipped ${currentPlayer.name}. Now showing ${nextPlayer.name}`);
      } else {
        await databases.updateDocument(
          appwriteConfig.databaseId, 
          appwriteConfig.auctionStateTableId, 
          appwriteConfig.auctionStateDocId, 
          { 
            statusMessage: "No more players",
            isAuctionActive: false,
          }
        );
        toast.warning("No more players to skip to!");
      }
    } catch (error) {
      console.error("Failed to skip player:", error);
      toast.error("Failed to skip player");
    } finally {
      setIsProcessing(false);
    }
  };

  // SIMPLIFIED: This ONLY updates the auction state document.
  const handlePlaceBid = async (houseId: string, amount: number) => {
    if (!auctionState?.isAuctionActive) return toast.error("Auction is not active.");
    
    const newBid = (auctionState.currentBid ?? 0) + amount;
    const house = houses.find(h => h.$id === houseId);
    if (!house) return; // Should not happen
    
    // Check against the LIVE balance from the hook. No function call needed.
    if (house.balance < newBid) return toast.error(`${house.name} has insufficient balance!`);
    
    await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.auctionStateTableId, appwriteConfig.auctionStateDocId, {
      currentBid: newBid,
      winningHouseId: houseId,
      statusMessage: "Bidding"
    });
    toast.success(`${house.name} bid ₹${newBid.toLocaleString()}`);
  };
  
  // SIMPLIFIED: This also ONLY updates the auction state document.
  const handleManualBid = async () => {
    if (!auctionState?.isAuctionActive) return toast.error("Auction is not active.");
    if (!selectedHouseForBid) return toast.error("Please select a house.");
    if (!manualBidAmount || Number(manualBidAmount) <= 0) return toast.error("Please enter a valid bid amount.");
    
    const bidAmount = Number(manualBidAmount);
    const house = houses.find(h => h.$id === selectedHouseForBid);
    if (!house) return;
    
    // Check if the bid is higher than current bid
    if (bidAmount <= (auctionState.currentBid ?? 0)) {
      return toast.error(`Bid must be higher than current bid of ₹${(auctionState.currentBid ?? 0).toLocaleString()}`);
    }
    
    // Check against the LIVE balance from the hook
    if (house.balance < bidAmount) return toast.error(`${house.name} has insufficient balance!`);
    
    await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.auctionStateTableId, appwriteConfig.auctionStateDocId, {
      currentBid: bidAmount,
      winningHouseId: selectedHouseForBid,
      statusMessage: "Bidding"
    });
    
    toast.success(`${house.name} bid ₹${bidAmount.toLocaleString()}`);
    setManualBidAmount(""); // Clear the input
    setSelectedHouseForBid(""); // Clear the selection
  };

  const handleSoldPlayer = async () => {
    if (!auctionState?.winningHouseId || !currentPlayer || isProcessing) return;
    setIsProcessing(true);
    try {
      await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.auctionStateTableId, appwriteConfig.auctionStateDocId, { isAuctionActive: false, statusMessage: "SOLD" });
      
      // The ONE and ONLY function call.
      const execution = await functions.createExecution(
        appwriteConfig.soldPlayerFunctionId,
        JSON.stringify({
          playerUniqueId: currentPlayer.uniqueId,
          houseId: auctionState.winningHouseId,
          price: auctionState.currentBid ?? 0,
        })
      );
      
      console.log('Function execution response:', execution);
      console.log('Function execution status:', execution.status);
      console.log('Function response:', execution.responseBody);
      
      // Check if function executed successfully
      if (execution.status === 'failed') {
        console.error('Function failed. Response:', execution.responseBody);
        throw new Error(`Function failed: ${execution.responseBody || 'Unknown error'}`);
      }
      
      toast.success(`${currentPlayer.name} sold to ${winningHouse?.name}!`);
      
      // Find next player in scheduled order
      const currentIndex = unsoldPlayers.findIndex(p => p.$id === currentPlayer.$id);
      const nextPlayer = unsoldPlayers[currentIndex + 1];
      
      setTimeout(async () => {
        if (nextPlayer) {
          await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.auctionStateTableId, appwriteConfig.auctionStateDocId, {
            currentPlayerId: nextPlayer.$id,
            currentBid: nextPlayer.basePrice,
            winningHouseId: "",
            statusMessage: "Next Player",
          });
        } else {
          // Get any player ID as a placeholder since we can't use null
          const anyPlayerId = players[0]?.$id || "";
          await databases.updateDocument(appwriteConfig.databaseId, appwriteConfig.auctionStateTableId, appwriteConfig.auctionStateDocId, { 
            statusMessage: "Complete",
            currentPlayerId: anyPlayerId,
            currentBid: 0,
            isAuctionActive: false,
          });
          toast.info("All players have been sold!");
        }
      }, 2500);
    } catch (error: unknown) {
      console.error("Failed to sell player:", error);
      if (error instanceof AppwriteException) { 
        toast.error(`Error: ${error.message}`); 
      } else if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else { 
        toast.error("An error occurred while selling player."); 
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || !auctionState) { return <div className="min-h-screen flex items-center justify-center text-2xl font-bold">Connecting...</div>; }

  return (
    <div className="min-h-screen bg-background py-12 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, hsl(var(--ink)) 40px, hsl(var(--ink)) 80px)`
      }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="relative text-center mb-16 animate-slide-up">
          <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 h-20 w-auto bg-ink rounded-2xl p-3 items-center justify-center shadow-depth-2 hover-lift-advanced transition-all duration-300">
            <img src="/BENNETT.png" alt="Bennett University Logo" className="h-full w-auto" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-foreground mb-3 tracking-tight">Admin Control Panel</h1>
          <p className="text-lg text-muted-foreground font-medium">Oversee and control the live auction.</p>
          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 h-20 w-auto bg-ink rounded-2xl p-3 items-center justify-center shadow-depth-2 hover-lift-advanced transition-all duration-300">
            <img src="/SPORTS.png" alt="Sports Committee Logo" className="h-full w-auto" />
          </div>
        </div>
        
        <Card className="p-8 mb-12 bg-paper rounded-3xl shadow-depth-3 animate-scale-in border-2 border-border/50">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleStartAuction} 
              disabled={auctionState.isAuctionActive || isProcessing} 
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 shadow-depth-2 hover:shadow-depth-3 transition-all duration-300 hover:scale-105"
            >
              <Play className="w-5 h-5" /> Start
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handlePauseAuction} 
              disabled={!auctionState.isAuctionActive || isProcessing} 
              className="gap-2 shadow-depth-1 hover:shadow-depth-2 transition-all duration-300 hover:scale-105 border-2"
            >
              <Pause className="w-5 h-5" /> Pause
            </Button>
            <Button 
              size="lg" 
              onClick={handleSoldPlayer} 
              disabled={!auctionState.winningHouseId || !auctionState.isAuctionActive || isProcessing} 
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-depth-2 hover:shadow-depth-4 transition-all duration-300 hover:scale-105 animate-pulse-glow"
            >
              <Gavel className="w-5 h-5" /> SOLD
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleSkipPlayer} 
              disabled={!currentPlayer || isProcessing} 
              className="gap-2 shadow-depth-1 hover:shadow-depth-2 transition-all duration-300 hover:scale-105 border-2"
            >
              <SkipForward className="w-5 h-5" /> Skip
            </Button>
            <Button 
              size="lg" 
              variant="destructive" 
              onClick={handleResetAuction} 
              disabled={isProcessing} 
              className="gap-2 shadow-depth-2 hover:shadow-depth-3 transition-all duration-300 hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" /> Reset Auction
            </Button>
          </div>
        </Card>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-3xl font-extrabold text-foreground">Current Player</h2>
            {currentPlayer ? (
              <>
                <PlayerCard player={currentPlayer} />
                <Card className="p-5 bg-paper rounded-2xl shadow-depth-2 hover:shadow-depth-3 transition-all duration-300 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Enrollment No.</p>
                  <p className="text-xl font-bold text-foreground font-mono tracking-tight">{currentPlayer.uniqueId}</p>
                </Card>
                <Card className="p-5 bg-paper rounded-2xl shadow-depth-2 hover:shadow-depth-3 transition-all duration-300 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Progress</p>
                  <p className="text-4xl font-black text-foreground tracking-tight">{unsoldPlayers.length > 0 ? (currentUnsoldIndex + 1) : 0} / {unsoldPlayers.length}</p>
                </Card>
              </>
            ) : (
              <Card className="p-8 bg-paper rounded-xl shadow-soft text-center">
                <h3 className="text-2xl font-bold text-foreground">Auction Complete!</h3>
              </Card>
            )}
          </div>
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground mb-6">Bid Controls</h2>
              <div className="space-y-4">
                {houses.map((house: HouseDocument, index: number) => (
                  <Card 
                    key={house.$id} 
                    className="p-5 bg-paper rounded-2xl shadow-depth-2 hover:shadow-depth-3 transition-all duration-500 border border-border/50 hover-lift-advanced animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shadow-depth-1 transition-all duration-300 hover:scale-110" 
                          style={{ backgroundColor: `${house.color}20`, color: house.color }}
                        >
                          {house.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground text-lg leading-tight">{house.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">₹{house.balance.toLocaleString()}</p>
                        </div>
                      </div>
                      {auctionState.winningHouseId === house.$id && (
                        <Badge className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 shadow-depth-2 animate-pulse">
                          Winning
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handlePlaceBid(house.$id, 100)} 
                        disabled={!auctionState.isAuctionActive || isProcessing}
                        className="transition-all duration-300 hover:scale-105 border-2 hover:shadow-depth-1"
                      >
                        +100
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handlePlaceBid(house.$id, 250)} 
                        disabled={!auctionState.isAuctionActive || isProcessing}
                        className="transition-all duration-300 hover:scale-105 border-2 hover:shadow-depth-1"
                      >
                        +250
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handlePlaceBid(house.$id, 500)} 
                        disabled={!auctionState.isAuctionActive || isProcessing}
                        className="transition-all duration-300 hover:scale-105 border-2 hover:shadow-depth-1"
                      >
                        +500
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <Card className="p-6 bg-paper rounded-2xl shadow-depth-2 border border-border/50 hover:shadow-depth-3 transition-all duration-300">
              <h3 className="text-2xl font-bold text-foreground mb-2">Manual Bid Entry</h3>
              <p className="text-sm text-muted-foreground mb-6 font-medium">For custom amounts.</p>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-center">
                <select value={selectedHouseForBid} onChange={(e) => setSelectedHouseForBid(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select House...</option>
                  {houses.map((house: HouseDocument) => (<option key={house.$id} value={house.$id}>{house.name}</option>))}
                </select>
                <Input type="number" placeholder="Enter custom amount" value={manualBidAmount} onChange={(e) => setManualBidAmount(e.target.value)} className="md:col-span-1" />
                <Button onClick={handleManualBid} disabled={!auctionState.isAuctionActive || isProcessing} className="gradient-primary text-primary-foreground">Place Bid</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Admin;