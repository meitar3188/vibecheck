"use client";
import React, { useRef, useEffect, useState } from 'react';

const MusicPlayer = ({ track, isPlaying, setIsPlaying, onNext, 
  onPrevious }: any) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7); // מתחילים ב-70% עוצמה

  /** * למה שני Effects נפרדים? 
   * הפרדה לוגית (Separation of Concerns): 
   * 1. ה-Effect הראשון אחראי רק על מצב הנגינה והחלפת שירים.
   * 2. ה-Effect השני אחראי רק על עוצמת הקול.
   * הפרדה זו מונעת הרצה מיותרת של פונקציות ה-play/pause בכל פעם שהמשתמש רק מזיז את הווליום.
   */
  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying, track]);

  // עדכון עוצמת הקול באלמנט האודיו בכל פעם שה-State משתנה
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!track) return null;

  return (
<>
    {/* זה הרכיב ה"שקוף" שעושה את כל העבודה השחורה */}
        <audio
        // התיקון: אם previewUrl ריק, נעביר null כדי למנוע את השגיאה שראינו
        ref={audioRef}
        src={track.previewUrl || null}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={onNext}
        // הוספת טיפול בשגיאות טעינה
          onError={() => {
            alert("שגיאה: לא ניתן לטעון את קובץ האודיו. ייתכן שהלינק שבור.");
            setIsPlaying(false);
          }}
        />
<div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 p-4 pb-8 sm:pb-4 z-50 shadow-2xl">
  <div className="max-w-6xl mx-auto flex flex-col gap-3">
    
    <div className="flex items-center justify-between gap-4">
      {/* 1. פרטי השיר - צמצום רווחים במובייל */}
      <div className="flex items-center gap-3 w-full sm:w-1/4">
        <img src={track.albumImageUrl} className="w-12 h-12 sm:w-14 sm:h-14 rounded shadow-lg object-cover flex-shrink-0" alt="" />
        <div className="min-w-0"> {/* מבטיח שהטקסט לא יעיף את הכל הצידה */}
          <div className="text-white font-bold text-sm truncate">{track.title}</div>
          {/* מחביא את שם האמן במסכים קטנים מאוד כדי לחסוך מקום */}
          <div className="text-zinc-400 text-xs truncate hidden xs:block">{track.artist}</div>
        </div>
      </div>

      {/* 2. כפתורי שליטה - תמיד במרכז */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="flex items-center gap-4 sm:gap-6">
          <button onClick={onPrevious} className="text-zinc-400 hover:text-white transition p-2">
            ⏮
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-white text-black p-3 rounded-full hover:scale-110 active:scale-95 transition shadow-lg"
          >
            {isPlaying ? '⏸' : '▶️'}
          </button>

          <button onClick={onNext} className="text-zinc-400 hover:text-white transition p-2">
            ⏭
          </button>
        </div>
      </div>

      {/* 3. ווליום - מחביאים במובייל לגמרי */}
      <div className="hidden sm:flex w-1/4 justify-end items-center gap-2 group">
        <span className="text-lg opacity-50">{volume === 0 ? '🔇' : '🔉'}</span>
        <input 
          type="range"
          min="0" max="1" step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-20 lg:w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
        />
      </div>
    </div>

    {/* 4. פס התקדמות - רוחב מלא תמיד */}
    <div className="flex items-center gap-3 w-full max-w-2xl mx-auto px-2">
      <span className="text-[10px] text-zinc-400 w-7 text-right tabular-nums">{formatTime(currentTime)}</span>
      <input 
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleProgressChange}
        className="flex-1 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
      />
      <span className="text-[10px] text-zinc-400 w-7 tabular-nums">{formatTime(duration)}</span>
    </div>

  </div>
</div>
</>
  );
};

export default MusicPlayer;