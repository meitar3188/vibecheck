// types/track.ts

export interface Track {
  id: string;          // ב-MongoDB זה תמיד String
  title: string;
  artist: string;
  albumImageUrl?: string; // לא חובה להביא תמונה לאלבום אבל רצוי
  previewUrl: string;
  createdAt?: string | Date; // אין ממש צורך לרוב זה יקרה באותו רגע
}

// טיפוס עזר ליצירת שיר חדש (בלי ה-ID שהשרת מייצר)
export type CreateTrackInput = Omit<Track, 'id' | 'createdAt'>;