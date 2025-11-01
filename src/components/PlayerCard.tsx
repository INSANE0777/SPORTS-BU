import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Star, Trophy } from "lucide-react";

interface PlayerDisplayData {
  name: string;
  uniqueId: string;
  course: string;
  photo: string;
  rating: number;
  sport: string;
}

interface PlayerCardProps {
  player: PlayerDisplayData;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  if (!player) return null;

  // Check if player is elite (rating 9+)
  const isElitePlayer = player.rating >= 9;

  return (
    <div className="relative pt-8">
      {/* Elite Player Badge */}
      {isElitePlayer && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-yellow-500 text-black px-6 py-2 rounded-lg shadow-depth-4 font-black text-sm animate-pulse">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            <span>ELITE PLAYER</span>
            <Trophy className="w-4 h-4" />
          </div>
        </div>
      )}
    
      <div className={`bg-paper rounded-2xl shadow-strong overflow-hidden transition-all duration-300 ${
        isElitePlayer 
          ? 'border-4 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] animate-pulse-glow' 
          : 'border border-border hover-lift-advanced'
      }`}>
        <div className="relative">
          {/* Golden overlay for elite players */}
          {isElitePlayer && (
            <div className="absolute inset-0 bg-yellow-400/10 pointer-events-none z-10"></div>
          )}
          
          <img src={player.photo} alt={player.name} className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105" />
          
          <div className="absolute top-3 right-3 z-10">
            <Badge className={`flex items-center gap-1 text-md backdrop-blur-sm border-none transition-all duration-300 ${
              isElitePlayer 
                ? 'bg-yellow-500 text-black font-extrabold shadow-depth-3' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}>
              <Star className={`w-4 h-4 ${isElitePlayer ? 'text-black fill-black' : 'text-yellow-400 fill-yellow-400'}`} />
              <span className="font-bold">{player.rating}</span>
            </Badge>
          </div>
        </div>
        
        <div className={`p-4 ${isElitePlayer ? 'bg-yellow-400/5' : ''}`}>
          <h3 className={`text-3xl font-black transition-colors duration-300 ${isElitePlayer ? 'text-yellow-600' : 'text-foreground'}`}>
            {player.name}
          </h3>
          <p className="text-sm text-muted-foreground/70 font-mono uppercase tracking-wide">
            {player.uniqueId}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">{player.course}</Badge>
            <Badge variant="outline" className="text-xs">{player.sport}</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;