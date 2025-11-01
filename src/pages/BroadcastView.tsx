import React, { useState, useEffect, useRef } from 'react';
import { useAuctionRealtime } from '@/hooks/useAuctionRealtime';
import { Card } from "@/components/ui/card";
import { Gavel } from "lucide-react";
import  PlayerCard  from '@/components/PlayerCard';
import { HouseDocument, PlayerDocument } from '@/types/appwrite';
import Confetti from 'react-confetti';

const BroadcastView: React.FC = () => {
  const { players, houses, auctionState, isLoading } = useAuctionRealtime();
  
  const [showSoldOverlay, setShowSoldOverlay] = useState(false);
  const [soldPlayerData, setSoldPlayerData] = useState<{ player: PlayerDocument, house: HouseDocument, price: number } | null>(null);
  const lastProcessedStatusRef = useRef<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const overlayCardRef = useRef<HTMLDivElement | null>(null);

  const currentPlayer = players.find(p => p.$id === auctionState?.currentPlayerId);
  const winningHouse = houses.find(h => h.$id === auctionState?.winningHouseId);

  // CORRECTED and SIMPLIFIED: This effect now triggers the animation reliably with useRef
  useEffect(() => {
    const currentStatus = auctionState?.statusMessage;
    
    // We trigger the animation only when the status message is "SOLD"
    // and we have the necessary data for the player and house that just won.
    // Check if this is a new SOLD status we haven't processed yet
    if (currentStatus === 'SOLD' && winningHouse && currentPlayer && lastProcessedStatusRef.current !== 'SOLD') {
      
      // Mark this status as processed
      lastProcessedStatusRef.current = 'SOLD';
      
      // Clean up any existing timer first
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      
      // At this moment, `currentPlayer` is the player who was just sold.
      // We capture their data before the state moves on to the next player.
      const soldData = { 
        player: currentPlayer, 
        house: winningHouse, 
        price: auctionState.currentBid ?? 0 
      };
      
      setSoldPlayerData(soldData);
      setShowSoldOverlay(true);
      
      // Auto-hide after 6 seconds - timer will persist even if status changes
      timerRef.current = setTimeout(() => {
        setShowSoldOverlay(false);
        setSoldPlayerData(null);
        timerRef.current = null;
        // Reset the processed flag so next SOLD can trigger
        lastProcessedStatusRef.current = null;
      }, 6000);
    }
    
    // Reset processed flag when status is no longer SOLD (but don't hide overlay if timer is running)
    if (currentStatus && currentStatus !== 'SOLD' && lastProcessedStatusRef.current === 'SOLD' && !timerRef.current) {
      lastProcessedStatusRef.current = currentStatus;
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    auctionState?.statusMessage, 
    auctionState?.currentBid,
    winningHouse,
    currentPlayer
  ]);

  // Handle click outside overlay card to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showSoldOverlay &&
        overlayCardRef.current &&
        !overlayCardRef.current.contains(event.target as Node)
      ) {
        // Clear timer if it exists
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        // Close overlay
        setShowSoldOverlay(false);
        setSoldPlayerData(null);
        lastProcessedStatusRef.current = null;
      }
    };

    if (showSoldOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showSoldOverlay]);

  if (isLoading || !auctionState) {
    return <div className="min-h-screen bg-paper flex items-center justify-center text-2xl font-bold">Connecting to Live Broadcast...</div>;
  }

  // This guard handles the brief moment between a player being sold and the next one loading
  if (!currentPlayer && !showSoldOverlay) {
    // If the auction is over, show complete message
    if (auctionState.statusMessage === 'Complete') {
        return (
          <div className="min-h-screen bg-paper flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-black text-primary">Auction Complete!</h1>
            <p className="text-2xl text-muted-foreground mt-4">Thank you for participating.</p>
          </div>
        );
    }
    // Otherwise, show a waiting message
    return <div className="min-h-screen bg-paper flex items-center justify-center text-4xl font-bold">Waiting for next player...</div>;
  }

  return (
    <div className="min-h-screen bg-paper text-foreground flex flex-col p-8 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(var(--ink)) 35px, hsl(var(--ink)) 70px)`
      }}></div>
      
      <header className="w-full flex items-center justify-between z-10 mb-8 animate-slide-up">
        <div className="h-20 w-auto bg-ink rounded-2xl p-3 flex items-center justify-center shadow-depth-2 hover-lift-advanced transition-all duration-300">
          <img src="/BENNETT.png" alt="Bennett University Logo" className="h-full w-auto" />
        </div>
        <div className={`relative flex items-center gap-4 font-bold text-3xl transition-all duration-500 px-6 py-3 rounded-2xl ${
          auctionState.isAuctionActive 
            ? 'text-primary bg-primary/5 shadow-depth-2 animate-glow-pulse' 
            : 'text-muted-foreground bg-muted/30'
        }`}>
          {auctionState.isAuctionActive && (
            <span className="relative flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-primary"></span>
            </span>
          )}
          <span className="tracking-wider">{auctionState.isAuctionActive ? 'LIVE' : 'PAUSED'}</span>
        </div>
        <div className="h-20 w-auto bg-ink rounded-2xl p-3 flex items-center justify-center shadow-depth-2 hover-lift-advanced transition-all duration-300">
          <img src="/SPORTS.png" alt="Sports Committee Logo" className="h-full w-auto" />
        </div>
      </header>

      <main className="flex-grow grid lg:grid-cols-2 gap-16 items-center z-10">
        <div className="flex items-center justify-center animate-scale-in">
          <div className="w-full max-w-lg transform transition-all duration-500 hover:scale-[1.02]">
            {currentPlayer && <PlayerCard player={currentPlayer} />}
          </div>
        </div>
        
        <div className="text-center space-y-12 animate-slide-up">
          <div className="relative">
            <p className="text-xl text-muted-foreground font-medium uppercase tracking-widest mb-4">CURRENT BID</p>
            <div className="relative inline-block">
              <h1 
                key={auctionState.currentBid}
                className="text-9xl font-black text-primary relative z-10 number-pop transition-all duration-300"
              >
                ₹{(auctionState.currentBid ?? 0).toLocaleString()}
              </h1>
              <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10"></div>
            </div>
          </div>
          
          <div className="relative">
            <p className="text-xl text-muted-foreground font-medium uppercase tracking-widest mb-4">LEADING HOUSE</p>
            {winningHouse ? (
              <div className="relative inline-block">
                <h2 
                  className="text-7xl font-bold transition-all duration-500 hover:scale-110 animate-float" 
                  style={{ color: winningHouse.color }}
                >
                  {winningHouse.name}
                </h2>
                <div className="absolute inset-0 opacity-20 blur-2xl" style={{ backgroundColor: winningHouse.color }}></div>
              </div>
            ) : (
              <h2 className="text-5xl font-bold text-muted-foreground">No Bids Yet</h2>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 z-10 mt-8">
        {houses.map((h: HouseDocument, index: number) => (
          <Card 
            key={h.$id} 
            className={`p-4 rounded-2xl border-2 transition-all duration-500 hover-lift-advanced animate-scale-in ${
              auctionState.winningHouseId === h.$id 
                ? 'bg-primary text-primary-foreground shadow-depth-3 scale-105 ring-4 ring-primary/20' 
                : 'bg-background border-border shadow-depth-1 hover:shadow-depth-2'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                  auctionState.winningHouseId === h.$id ? 'bg-primary-foreground/20' : ''
                }`}
                style={{ 
                  backgroundColor: auctionState.winningHouseId === h.$id ? 'rgba(255,255,255,0.2)' : `${h.color}20`, 
                  color: h.color 
                }}
              >
                {h.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm leading-tight truncate">{h.name}</h4>
                <p className={`text-xs font-mono ${auctionState.winningHouseId === h.$id ? 'opacity-80' : 'text-muted-foreground'}`}>
                  ₹{h.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </footer>

      {showSoldOverlay && soldPlayerData && (
        <div className="fixed inset-0 bg-ink/95 backdrop-blur-2xl flex flex-col items-center justify-center z-[100] animate-fade-in p-4 overflow-y-auto">
          <Confetti 
            width={window.innerWidth} 
            height={window.innerHeight} 
            recycle={false} 
            numberOfPieces={500} 
            gravity={0.08}
            style={{ position: 'fixed', top: 0, left: 0 }}
          />
          
          {/* Animated background pulse */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at center, ${soldPlayerData.house.color}40 0%, transparent 70%)`,
              animation: 'pulse-glow 2s ease-in-out infinite'
            }}
          ></div>
          
          <div className="relative w-full max-w-2xl mx-auto my-auto">
            {/* Top banner with SOLD text - positioned outside card */}
            <div className="relative w-full mb-4">
              <div className="px-10 py-3 bg-primary text-primary-foreground rounded-2xl shadow-depth-4 animate-slide-up border-4 border-primary/20 inline-block mx-auto">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse"></div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase">SOLD</h2>
                  <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <div 
              ref={overlayCardRef}
              className="relative w-full bg-paper rounded-3xl shadow-depth-4 border-4 animate-scale-in overflow-hidden" 
              style={{ borderColor: soldPlayerData.house.color }}
            >
            
              {/* Player image with overlay - moved to top */}
              <div className="relative overflow-hidden">
                <div 
                  className="absolute inset-0 z-10 pointer-events-none opacity-15"
                  style={{
                    backgroundColor: soldPlayerData.house.color
                  }}
                ></div>
                <img 
                  src={soldPlayerData.player.photo} 
                  alt={soldPlayerData.player.name} 
                  className="w-full h-80 object-cover transition-transform duration-1000 hover:scale-105" 
                />
                
                {/* Player info overlay on image */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-ink/90">
                  <h3 className="text-3xl font-black text-paper tracking-tight mb-1">{soldPlayerData.player.name}</h3>
                  <p className="text-paper/80 text-sm font-mono uppercase tracking-widest">{soldPlayerData.player.uniqueId}</p>
                </div>
              </div>
              
              {/* Price section - between image and house */}
              <div className="px-8 py-6 text-center bg-paper border-b-2 border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-bold mb-4">Sold For</p>
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10 animate-glow-pulse"></div>
                  <p className="text-6xl font-black text-primary number-pop tracking-tight leading-none">
                    ₹{soldPlayerData.price.toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* House section */}
              <div className="px-8 py-8 text-center bg-paper">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.3em] font-bold mb-5">Acquired By</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-5 w-full">
                  <div 
                    className="w-18 h-18 rounded-xl flex items-center justify-center text-3xl font-black shadow-depth-3 transition-all duration-500 hover:scale-110 hover:rotate-3 flex-shrink-0" 
                    style={{ 
                      backgroundColor: soldPlayerData.house.color || '#193497', 
                      color: 'white',
                      boxShadow: `0 0 30px ${(soldPlayerData.house.color || '#193497')}50`,
                      width: '72px',
                      height: '72px'
                    }}
                  >
                    {soldPlayerData.house.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0 max-w-full">
                    <h4 
                      className="text-5xl font-black tracking-tight leading-tight break-words text-center"
                      style={{ 
                        color: soldPlayerData.house.color || '#193497',
                        textShadow: `0 2px 8px ${(soldPlayerData.house.color || '#193497')}30`
                      }}
                    >
                      {soldPlayerData.house.name || 'Unknown House'}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2 font-medium text-center">House</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcastView;