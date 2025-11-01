import React, { useMemo, useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuctionRealtime } from "@/hooks/useAuctionRealtime";
import  PlayerCard  from "@/components/PlayerCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Star, PartyPopper } from "lucide-react";
import { HouseDocument } from "@/types/appwrite";

const HouseView: React.FC = () => {
  const { houseId } = useParams<{ houseId: string }>();
  const { players, houses, auctionState, isLoading } = useAuctionRealtime();

  const [showYouWonOverlay, setShowYouWonOverlay] = useState(false);
  const overlayCardRef = useRef<HTMLDivElement | null>(null);

  const house = houses.find((h) => h.$id === houseId);
  const currentPlayer = players.find(p => p.$id === auctionState?.currentPlayerId);
  const winningHouse = houses.find(h => h.$id === auctionState?.winningHouseId);

  // CORRECTED useMemo HOOK
  const spotlightPlayers = useMemo(() => {
    if (!currentPlayer) return [];
    return players
      .filter(p => !p.isSold && p.$id !== currentPlayer.$id)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [
    // Corrected dependency array only includes `players`
    players 
  ]);

  useEffect(() => {
    if (
      auctionState?.statusMessage === 'SOLD' &&
      auctionState?.winningHouseId === houseId
    ) {
      setShowYouWonOverlay(true);
      const timer = setTimeout(() => setShowYouWonOverlay(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [auctionState?.statusMessage, auctionState?.winningHouseId, houseId]);

  // Handle click outside overlay card to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showYouWonOverlay &&
        overlayCardRef.current &&
        !overlayCardRef.current.contains(event.target as Node)
      ) {
        setShowYouWonOverlay(false);
      }
    };

    if (showYouWonOverlay) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showYouWonOverlay]);

  if (isLoading || !auctionState) { return <div className="min-h-screen flex items-center justify-center">Connecting...</div>; }
  if (!house) { return <div>House Not Found.</div>; }
  if (!currentPlayer) { return <div>Auction Complete.</div>; }

  return (
    <div className="min-h-screen bg-background py-12 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, hsl(var(--ink)) 40px, hsl(var(--ink)) 80px)`
      }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="relative text-center mb-12 animate-slide-up">
          <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 h-20 w-auto bg-ink rounded-2xl p-3 items-center justify-center shadow-depth-2 hover-lift-advanced transition-all duration-300">
            <img src="/BENNETT.png" alt="Bennett University Logo" className="h-full w-auto" />
          </div>
          <div className="inline-block text-center">
            <div className="flex justify-center items-center gap-4">
               <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold shadow-depth-2 transition-all duration-300 hover:scale-110" style={{ backgroundColor: `${house.color}20`, color: house.color }}>{house.name.charAt(0)}</div>
              <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tight">{house.name}</h1>
            </div>
            <p className="text-lg text-muted-foreground mt-2 font-medium">Live Auction View</p>
          </div>
          <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 h-20 w-auto bg-ink rounded-2xl p-3 items-center justify-center shadow-depth-2 hover-lift-advanced transition-all duration-300">
            <img src="/SPORTS.png" alt="Sports Committee Logo" className="h-full w-auto" />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-extrabold text-foreground">Live Auction</h2>
              <div className={`relative flex items-center gap-2 font-bold transition-colors ${auctionState.isAuctionActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {auctionState.isAuctionActive && <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span></span>}
                {auctionState.isAuctionActive ? 'LIVE' : 'PAUSED'}
              </div>
            </div>
            <Card className="p-8 bg-paper rounded-3xl shadow-depth-3 border border-border/50 animate-scale-in">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6"><PlayerCard player={currentPlayer} /></div>
                <div className="space-y-5">
                  <h3 className="text-2xl font-bold text-foreground mb-6">Bid Status</h3>
                  <div className="p-5 bg-background rounded-2xl shadow-depth-1 hover:shadow-depth-2 transition-all duration-300 border border-border/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Current Bid</p>
                    <p 
                      key={auctionState.currentBid}
                      className="text-5xl font-black text-primary number-pop transition-all duration-300"
                    >
                      ₹{(auctionState.currentBid ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-5 bg-background rounded-2xl shadow-depth-1 hover:shadow-depth-2 transition-all duration-300 border border-border/30">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Leading House</p>
                    <p className="text-2xl font-bold text-foreground">{winningHouse?.name || 'No Bids Yet'}</p>
                  </div>
                  {winningHouse?.$id === house.$id && (
                    <div className="p-5 rounded-2xl bg-primary text-primary-foreground shadow-depth-3 animate-bounce-in border-2 border-primary/20">
                      <p className="text-center font-bold text-lg">You are the highest bidder!</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-extrabold text-foreground">House Status</h2>
            <div className="space-y-4">
              <Card className="p-5 bg-paper rounded-2xl shadow-depth-3 ring-4 ring-primary/30 border-2 border-primary animate-scale-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-1">{house.name} (You)</h3>
                    <p className="text-3xl font-black text-foreground font-mono tracking-tight">₹{house.balance.toLocaleString()}</p>
                  </div>
                  <Wallet className="w-10 h-10 text-primary animate-float" />
                </div>
              </Card>
              {houses.filter(h => h.$id !== houseId).map((h: HouseDocument, index: number) => (
                <Card 
                  key={h.$id} 
                  className="p-4 bg-paper rounded-2xl shadow-depth-1 hover:shadow-depth-2 transition-all duration-300 border border-border/50 hover-lift-advanced animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-md font-bold shadow-depth-1 transition-all duration-300 hover:scale-110" style={{ backgroundColor: `${h.color}20`, color: h.color }}>{h.name.charAt(0)}</div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm leading-tight">{h.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono">₹{h.balance.toLocaleString()}</p>
                      </div>
                    </div>
                    {winningHouse?.$id === h.$id && (
                      <Badge variant="outline" className="text-xs font-bold border-2">Leading</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-extrabold text-foreground">Spotlight Players</h2>
            <div className="space-y-3">
              {spotlightPlayers.map((player, index) => (
                <Link to="#" key={player.$id}>
                  <Card className="p-4 bg-paper rounded-2xl shadow-depth-1 border border-transparent transition-all duration-300 hover:border-primary hover:shadow-depth-3 hover-lift-advanced animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-xl object-cover shadow-depth-1 transition-transform duration-300 hover:scale-110"/>
                        <div>
                          <h4 className="font-bold text-foreground text-sm leading-tight">{player.name}</h4>
                          <p className="text-xs text-muted-foreground">{player.sport}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1 text-sm border-2 font-semibold">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {player.rating}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showYouWonOverlay && (
        <div className="fixed inset-0 bg-ink/95 backdrop-blur-2xl flex flex-col items-center justify-center z-[100] animate-fade-in p-8">
          {/* Animated background pulse */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at center, ${house.color}40 0%, transparent 70%)`,
              animation: 'pulse-glow 2s ease-in-out infinite'
            }}
          ></div>
          
          <div 
            ref={overlayCardRef}
            className="relative bg-paper rounded-3xl p-16 shadow-depth-4 border-4 border-primary animate-scale-in max-w-2xl w-full text-center"
          >
            {/* Top badge */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-10 py-4 bg-primary text-primary-foreground rounded-2xl shadow-depth-4 animate-slide-up border-4 border-primary/20">
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse"></div>
                <h2 className="text-5xl font-black tracking-tighter uppercase">VICTORY</h2>
                <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse"></div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="space-y-8">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-scale-in">
                  <PartyPopper className="w-16 h-16 text-primary animate-float" />
                </div>
              </div>
              
              {/* Main heading */}
              <div>
                <h1 className="text-7xl font-black text-primary mb-4 tracking-tight number-pop">
                  YOU WON!
                </h1>
                <div className="w-32 h-1 bg-primary mx-auto rounded-full"></div>
              </div>
              
              {/* Player info */}
              <div className="space-y-3">
                <p className="text-2xl text-foreground font-medium">
                  <span className="font-black text-primary">{currentPlayer.name}</span>
                </p>
                <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">
                  Has joined your house
                </p>
              </div>
              
              {/* House name */}
              <div className="pt-6 border-t border-border/50">
                <div className="flex items-center justify-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-depth-3 transition-all duration-500 hover:scale-110" 
                    style={{ 
                      backgroundColor: house.color,
                      boxShadow: `0 0 30px ${house.color}50`
                    }}
                  >
                    {house.name.charAt(0)}
                  </div>
                  <h2 className="text-6xl font-black tracking-tight" style={{ color: house.color }}>
                    {house.name}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseView;