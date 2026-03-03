"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import TrackCard from '../components/TrackCard';
import MusicPlayer from '../components/MusicPlayer';
import { Track, CreateTrackInput } from '@/types/track';
// הערה: מחקתי את הייבוא של prisma מכאן כי זה Client Component

export default function Home() {
  // --- States לשירים וטעינה ---
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- States לממשק המשתמש ---
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- State עבור הנגן המרכזי ---
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // --- State עבור הוספת שיר חדש ---
  const [newTrack, setNewTrack] = useState<CreateTrackInput>({
    title: '',
    artist: '',
    albumImageUrl: '',
    previewUrl: '' // עכשיו השדה הזה קיים ומוכן לקבל את הלינק מה-Input
  });

  // --- Effects (טעינת נתונים) ---

  // 1. טעינת השירים מה-DB
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/tracks');
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setTracks(data); // כאן נכנסים השירים מה-MongoDB!
      } catch (error) {
        console.error("Error fetching tracks from DB:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTracks();
  }, []);

  // 2. טעינת מועדפים מ-LocalStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('vibe-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // 3. שמירת מועדפים ל-LocalStorage
  useEffect(() => {
    localStorage.setItem('vibe-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // --- Functions (לוגיקה) ---

const handleAddTrack = async (e: React.FormEvent) => {
  e.preventDefault();

  // בדיקה שהלינק מסתיים בסיומת אודיו תקינה או שהוא נתיב מקומי
  const urlPattern = /\.(mp3|wav|ogg|m4a)$|^\//i;
  
  if (!urlPattern.test(newTrack.previewUrl)) {
    alert("אנא הזן לינק תקין לקובץ מוזיקה (למשל: .mp3) או נתיב מקומי המתחיל ב-/");
    return;
  }
  
  try {
    const response = await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTrack),
    });

    if (response.ok) {
      const addedTrack = await response.json();
      setTracks(prev => [addedTrack, ...prev]);
      setIsModalOpen(false); // סגירת המודל
      
      // איפוס ה-State כולל ה-previewUrl
      setNewTrack({ title: '', artist: '', albumImageUrl: '', previewUrl: '' });
      
      // הודעת הצלחה
      alert("✅ השיר נוסף בהצלחה ל-VibeCheck!");
    }
  } catch (error) {
    alert("❌ שגיאה בשמירת השיר");
    console.error("Error adding track:", error);
  }
};

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const playNextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setIsPlaying(true);
  };

  const playPreviousTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    // נוסחה שמוודאת שלא נרד מתחת ל-0 (חוזר לסוף הרשימה)
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[prevIndex]);
    setIsPlaying(true);
  };

  const handlePlayTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const filteredTracks = Array.isArray(tracks) ? tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFav = showOnlyFavorites ? favorites.includes(track.id) : true;
    return matchesSearch && matchesFav;
  }) : []; // אם tracks הוא לא מערך, נחזיר מערך ריק כדי למנוע קריסה

  // בתוך Home קומפוננטה ב-page.tsx:

const handleDeleteTrack = async (id: string) => {
  if (!confirm("האם אתה בטוח שברצונך למחוק את השיר לצמיתות?")) return;
      try {
        const response = await fetch(`/api/tracks?id=${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // עדכון ה-State: משאירים רק את השירים שה-ID שלהם שונה מזה שנמחק
          setTracks(prev => prev.filter(track => track.id !== id));
          
          // אם השיר שנמחק הוא זה שמתנגן כרגע - נעצור את הנגן
          if (currentTrack?.id === id) {
            setCurrentTrack(null);
            setIsPlaying(false);
          }
        }
      } catch (error) {
        alert("שגיאה במחיקת השיר");
    }
  }

  return (
    <main className="min-h-screen bg-black p-8 text-white pb-32"> {/* pb-32 נותן רווח לנגן למטה */}
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h1 className="text-5xl font-black italic">Vibe<span className="text-green-500">Check</span></h1>
          
          <div className="flex items-center gap-4">
            {/* כפתור פלוס חדש */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-3 bg-green-500 rounded-full text-black hover:scale-110 transition-all shadow-lg"
            >
              <Plus size={24} />
            </button>

            <button 
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`px-4 py-2 rounded-full border transition-all ${
                showOnlyFavorites ? 'bg-green-500 text-black' : 'text-zinc-400'
              }`}
            >
              {showOnlyFavorites ? '❤️ מועדפים' : 'הכל'}
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 size-4" />
              <input
                type="text"
                placeholder="חפש שיר..."
                className="bg-zinc-900 border border-zinc-800 py-3 pl-10 pr-6 rounded-full outline-none focus:ring-2 focus:ring-green-500"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Grid שירים */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredTracks.map((track, index) => (
            <div 
              key={track.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-500" 
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TrackCard
                key={track.id} 
                track={track}
                isFavorite={favorites.includes(track.id)}
                onFavoriteToggle={() => toggleFavorite(track.id)}
                isActive={currentTrack?.id === track.id}
                isPlaying={isPlaying}
                onPlay={() => handlePlayTrack(track)}
                onDelete={() => handleDeleteTrack(track.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* מודל הוספת שיר (Modal) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 text-right">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 left-4 text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-green-500">הוסף Vibe חדש</h2>
              <form onSubmit={handleAddTrack} className="space-y-4">
                {/* שם השיר - חובה */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">שם השיר *</label>
                  <input
                    required
                    placeholder="למשל: אבא שמעון"
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg outline-none focus:border-green-500 text-white"
                    value={newTrack.title}
                    onChange={e => setNewTrack({...newTrack, title: e.target.value})}
                  />
                </div>

                {/* אמן - חובה */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">אמן *</label>
                  <input
                    required
                    placeholder="שם האמן"
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg outline-none focus:border-green-500 text-white"
                    value={newTrack.artist}
                    onChange={e => setNewTrack({...newTrack, artist: e.target.value})}
                  />
                </div>

                {/* לינק לשיר - חובה חדשה! */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">לינק לקובץ MP3 *</label>
                  <input
                    required
                    placeholder="https://example.com/song.mp3"
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg outline-none focus:border-green-500 text-white text-left"
                    value={newTrack.previewUrl}
                    onChange={e => setNewTrack({...newTrack, previewUrl: e.target.value})}
                  />
                </div>

                {/* לינק לתמונה - אופציונלי */}
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">URL לתמונת אלבום</label>
                  <input
                    placeholder="https://example.com/cover.jpg"
                    className="w-full bg-black border border-zinc-800 p-3 rounded-lg outline-none focus:border-green-500 text-white text-left"
                    value={newTrack.albumImageUrl}
                    onChange={e => setNewTrack({...newTrack, albumImageUrl: e.target.value})}
                  />
                </div>

                <button type="submit" className="w-full bg-green-500 text-black font-black py-4 rounded-lg mt-4 hover:bg-green-400 transition-all shadow-lg active:scale-95">
                  שמור שיר ב-DATABASE
                </button>
              </form>
          </div>
        </div>
      )}

      {/* הנגן המרכזי שיופיע רק אם נבחר שיר */}
      {currentTrack && (
        <MusicPlayer 
          track={currentTrack}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          onNext={playNextTrack}
          onPrevious={playPreviousTrack} // החיבור כאן
        />
      )}
    </main>
  );
}