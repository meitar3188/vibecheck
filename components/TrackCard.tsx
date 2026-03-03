"use client";
import React from 'react';
import { Track } from '@/types/track'; // ייבוא ה-Interface שיצרנו
// בתוך TrackCard.tsx, הוסף את ה-Trash מ-lucide-react
import { Trash2 } from 'lucide-react';

interface TrackCardProps {
  track: Track;               // מקבל את כל אובייקט השיר
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onPlay: () => void; // פונקציה חדשה שהאבא יביא
  isActive: boolean;  // האם השיר הזה הוא זה שמתנגן כרגע?
  isPlaying: boolean;
  onDelete?: () => void; // פונקציה אופציונלית למחיקה
}

const TrackCard: React.FC<TrackCardProps> = ({ 
  track, // משתמשים באובייקט השיר
  isFavorite, 
  onFavoriteToggle, 
  onPlay, 
  isActive,
  isPlaying,
  onDelete 
}) => {
  return (
    <div className={`group relative flex flex-col p-4 rounded-xl transition-all shadow-lg ${
      isActive ? 'bg-zinc-700 ring-2 ring-green-500' : 'bg-zinc-900 hover:bg-zinc-800'
    }`}>
      
      {/* כפתור מועדפים */}
      <button 
        onClick={(e) => { e.stopPropagation(); onFavoriteToggle(); }}
        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/40 hover:scale-110 transition-transform"
      >
        <span className={isFavorite ? "text-red-500" : "text-white opacity-50"}>
          {isFavorite ? '❤️' : '🤍'}
        </span>
      </button>
      {/* כפתור מחיקה*/}
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          if(confirm('למחוק את השיר לצמיתות?')) onDelete?.();
        }}
        className="absolute top-6 left-6 z-10 p-2 rounded-full bg-black/40 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 size={18} />
      </button>
      {/* תמונת אלבום וכפתור ניגון */}
      <div className="relative aspect-square overflow-hidden rounded-md mb-4 cursor-pointer" onClick={onPlay}>
        <img src={track.albumImageUrl} alt={track.title} className="object-cover w-full h-full" />
        
        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
                    <div
              onClick={(e) => {
                e.stopPropagation(); // מונע אירועים כפולים אם יש onClick על הכרטיס כולו
                onPlay();
                }}
            className="bg-green-500 p-4 rounded-full shadow-xl text-black text-2xl hover:scale-110 cursor-pointer active:scale-95 transition-transform duration-200"
          >
 
            {isActive && isPlaying ? (
              <div className="flex items-end gap-[3px] h-5 mb-[2px]">
                <div className="w-1 bg-black animate-[bounce_0.6s_infinite]"></div>
                <div className="w-1 bg-black animate-[bounce_0.9s_infinite]"></div>
                <div className="w-1 bg-black animate-[bounce_0.7s_infinite]"></div>
              </div>
            ) : (
              <span className="pointer-events-none">
                {isActive ? '🔊' : '▶️'}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* פרטי השיר */}
      <h3 className="text-white font-bold truncate">{track.title}</h3>
      <p className="text-zinc-400 text-sm">{track.artist}</p>
    </div>
  );
};

export default TrackCard;