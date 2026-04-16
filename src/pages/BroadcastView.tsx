import React, { useState, useEffect, useRef } from 'react';
import { useAuctionRealtime } from '@/hooks/useAuctionRealtime';
import { Card } from "@/components/ui/card";
import { Gavel } from "lucide-react";
import  PlayerCard  from '@/components/PlayerCard';
import { HouseDocument, PlayerDocument } from '@/types/appwrite';
import Confetti from 'react-confetti';
import { normalizePlayerPhoto } from '@/utils/playerPhotos';

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
            <h1 className="text-6xl font-black text-primary uppercase">Auction Complete!</h1>
            <p className="text-2xl text-muted-foreground mt-4 uppercase tracking-widest font-semibold text-foreground tracking-tight underline">Thank you for participating.</p>
          </div>
        );
    }
    // Otherwise, show a waiting message
    return <div className="min-h-screen bg-paper flex items-center justify-center text-4xl font-black uppercase text-foreground tracking-tight underline">Waiting for next player...</div>;
  }

  return (
    <div className="h-screen bg-paper text-foreground flex flex-col p-6 relative overflow-visible">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, hsl(var(--ink)) 35px, hsl(var(--ink)) 70px)`
      }}></div>
      
      <header className="w-full flex items-center justify-between z-10 mb-4 animate-slide-up">
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
          <span className="tracking-wider uppercase">{auctionState.isAuctionActive ? 'LIVE' : 'PAUSED'}</span>
        </div>
        <div className="h-20 w-auto bg-ink rounded-2xl p-3 flex items-center justify-center shadow-depth-2 hover-lift-advanced transition-all duration-300">
          <img src="/SPORTS.png" alt="Sports Committee Logo" className="h-full w-auto" />
        </div>
      </header>

      <main className="flex-grow grid lg:grid-cols-2 gap-16 items-center z-10">
        {auctionState.statusMessage !== 'SOLD' ? (
          <>
            <div className="flex items-center justify-center animate-scale-in">
              <div className="w-full max-w-xl transform transition-all duration-500 hover:scale-[1.05]">
                {currentPlayer && <PlayerCard player={currentPlayer} />}
              </div>
            </div>
            
            <div className="text-center space-y-4 animate-slide-up">
              <div className="relative">
                <p className="text-xl text-muted-foreground font-medium uppercase tracking-widest mb-4">CURRENT BID</p>
                <div className="relative inline-block">
                  <h1 
                    key={auctionState.currentBid}
                    className="text-[10rem] md:text-[12rem] lg:text-[14rem] font-black relative z-10 number-pop transition-all duration-300 leading-none"
                    style={{ color: winningHouse ? winningHouse.color : '#193497' }}
                  >
                    {(auctionState.currentBid ?? 0).toLocaleString()}
                  </h1>
                  <div 
                    className="absolute inset-0 blur-[100px] -z-10 opacity-30 transition-all duration-500"
                    style={{ backgroundColor: winningHouse ? winningHouse.color : '#193497' }}
                  ></div>
                </div>
              </div>
              
              <div className="relative">
                <p className="text-xl text-muted-foreground font-medium uppercase tracking-widest mb-4">LEADING HOUSE</p>
                {winningHouse ? (
                  <div className="relative inline-block">
                    <h2 
                      className="text-8xl font-black transition-all duration-500 hover:scale-110 animate-float tracking-tight" 
                      style={{ color: winningHouse.color }}
                    >
                      {winningHouse.name.toUpperCase()}
                    </h2>
                    <div className="absolute inset-0 opacity-20 blur-3xl" style={{ backgroundColor: winningHouse.color }}></div>
                  </div>
                ) : (
                  <h2 className="text-5xl font-bold text-muted-foreground uppercase tracking-widest">No Bids Yet</h2>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="text-center space-y-6 animate-pulse">
                <h2 className="text-4xl font-black text-muted-foreground/30 uppercase tracking-[0.5em]">Auction Paused</h2>
                <p className="text-xl text-muted-foreground/20 font-bold uppercase tracking-widest">Waiting for next player registration...</p>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 z-10 mt-auto pb-4">
        {houses.map((h: HouseDocument, index: number) => (
          <Card 
            key={h.$id} 
            className={`p-4 rounded-2xl border-2 transition-all duration-500 hover-lift-advanced animate-scale-in ${
              auctionState.winningHouseId === h.$id 
                ? 'text-white shadow-[0_0_30px_rgba(0,0,0,0.2)] scale-105 ring-4 ring-white/10' 
                : 'bg-background border-border shadow-depth-1 hover:shadow-depth-2'
            }`}
            style={{ 
              animationDelay: `${index * 50}ms`,
              backgroundColor: auctionState.winningHouseId === h.$id ? h.color : undefined,
              borderColor: auctionState.winningHouseId === h.$id ? h.color : undefined
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className={`w-20 h-20 flex-shrink-0 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-depth-1 overflow-hidden ${
                  auctionState.winningHouseId === h.$id ? 'scale-110 shadow-lg border-2 border-white/30 bg-white/20' : 'bg-white'
                }`}
              >
                {h.logo ? (
                  <img 
                    src={h.logo} 
                    alt={h.name} 
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span className="text-xl font-bold" style={{ color: h.color }}>{h.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-black text-sm leading-tight truncate uppercase ${auctionState.winningHouseId === h.$id ? 'text-white' : 'text-foreground/80'}`}>
                  {h.name}
                </h4>
                <p 
                  className="text-lg font-black font-mono mt-1"
                  style={{ color: auctionState.winningHouseId === h.$id ? 'white' : h.color }}
                >
                  {h.balance.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </footer>

      {showSoldOverlay && soldPlayerData && (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] p-4 overflow-y-auto pt-16 pb-12">
          {/* Cinematic Background Spotlight */}
          <div 
            className="absolute top-1/2 left-1/2 w-[200vw] h-[200vh] -translate-x-1/2 -translate-y-1/2 animate-spotlight-rotate opacity-30 blur-[120px]"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, ${soldPlayerData.house.color} 0%, transparent 40%, ${soldPlayerData.house.color} 50%, transparent 90%, ${soldPlayerData.house.color} 100%)`
            }}
          ></div>
          
          <Confetti 
            width={window.innerWidth} 
            height={window.innerHeight} 
            recycle={true} 
            numberOfPieces={300} 
            gravity={0.15}
            colors={[soldPlayerData.house.color, '#FFFFFF', '#FFD700']}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 101 }}
          />
          
          <div className="relative z-[110] w-full max-w-2xl animate-card-entrance my-auto">
            {/* Top SOLD Banner */}
            <div className="flex justify-center -mb-6 relative z-20">
              <div className="bg-primary px-12 py-3 rounded-full shadow-[0_0_50px_rgba(25,52,151,0.5)] border-4 border-white/20 overflow-hidden relative">
                <div className="absolute inset-0 animate-shimmer-fast opacity-50"></div>
                <h2 className="text-4xl font-black text-white tracking-tighter italic">SOLD!</h2>
              </div>
            </div>
            
            <div 
              ref={overlayCardRef}
              className="bg-paper rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] border-[6px] overflow-hidden flex flex-col max-h-[80vh]" 
              style={{ borderColor: soldPlayerData.house.color }}
            >
              {/* Image Section */}
              <div className="relative h-96 bg-neutral-100 flex items-center justify-center overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{ backgroundColor: soldPlayerData.house.color }}
                ></div>
                <img 
                  src={normalizePlayerPhoto(soldPlayerData.player.name, soldPlayerData.player.photo)} 
                  alt={soldPlayerData.player.name} 
                  className="h-full w-full object-contain relative z-10 p-4 transform transition-transform duration-700 hover:scale-110" 
                />
                
                {/* ID Tag */}
                <div className="absolute top-6 left-6 z-20 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <p className="text-white font-mono text-sm tracking-widest">{soldPlayerData.player.uniqueId}</p>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="px-10 py-8 text-center flex flex-col gap-6">
                <div>
                  <h3 className="text-5xl font-black text-foreground uppercase tracking-tight mb-2">
                    {soldPlayerData.player.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-1 w-12 rounded-full" style={{ backgroundColor: soldPlayerData.house.color }}></div>
                    <span className="text-muted-foreground font-bold tracking-widest uppercase text-sm">Professional Athlete</span>
                    <div className="h-1 w-12 rounded-full" style={{ backgroundColor: soldPlayerData.house.color }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-6 rounded-3xl border border-border/50">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground mb-2">SOLD FOR</p>
                    <p className="text-6xl font-black text-primary animate-price-flash leading-none">
                      {soldPlayerData.price.toLocaleString()}
                    </p>
                  </div>
                  
                  <div 
                    className="p-6 rounded-3xl border flex flex-col items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: `${soldPlayerData.house.color}10`,
                      borderColor: `${soldPlayerData.house.color}30`
                    }}
                  >
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-muted-foreground">ACQUIRED BY</p>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black text-white shadow-xl overflow-hidden border-2 border-white/20"
                        style={{ backgroundColor: soldPlayerData.house.color }}
                      >
                        {soldPlayerData.house.logo ? (
                          <img 
                            src={soldPlayerData.house.logo} 
                            alt={soldPlayerData.house.name} 
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          soldPlayerData.house.name.charAt(0)
                        )}
                      </div>
                      <h4 
                        className="text-4xl font-black tracking-tighter text-shadow-glow"
                        style={{ color: soldPlayerData.house.color }}
                      >
                        {soldPlayerData.house.name}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Celebration Text */}
            <div className="mt-8 text-center animate-bounce-slow">
              <p className="text-white/60 font-bold tracking-[0.5em] uppercase text-xs">A new star has joined the league</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BroadcastView;