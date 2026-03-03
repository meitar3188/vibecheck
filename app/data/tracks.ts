// app/data/tracks.ts

// הגדרת הטיפוס וייצוא שלו
export interface Track {
  id: number;
  title: string;
  artist: string;
  albumImageUrl: string;
  previewUrl: string;
}

export const INITIAL_TRACKS = [
  {
    id: 1,
    title: "Aba Shimon",
    artist: "Artist Name",
    albumImageUrl: "https://via.placeholder.com/300",
    previewUrl: "/AbaShimonMP3.mp3"
  },
  {
    id: 2,
    title: "Starboy",
    artist: "The Weeknd",
    albumImageUrl: "https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png",
    previewUrl: "/AbaShimonMP3.mp3" // כרגע משתמש באותו קובץ לבדיקה
  },
  // תוסיף כאן עוד שירים אם תרצה
];