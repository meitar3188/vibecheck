import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const VIBE_TRACKS = [
  //במידה ונרצה להוסיף שירים במסה, זה המבנה להזנה ל DB
  //חשוב מאוד שזה יהיה בלי ID מונגו מייצר לבד, וגם כי זה מחרוזת במונגו חרא עליהם.
  /*{
    title: "שיר לדוגמה 1",
    artist: "אמן א'",
    albumImageUrl: "https://via.placeholder.com/300",
    previewUrl: ""
  },
  {
    title: "שיר לדוגמה 2",
    artist: "אמן ב'",
    albumImageUrl: "https://via.placeholder.com/300",
    previewUrl: ""
  }*/
  {
    title: "Aba Shimon",
    artist: "Artist Name",
    albumImageUrl: "https://via.placeholder.com/300",
    previewUrl: "/AbaShimonMP3.mp3"
  },
  {
    title: "Starboy",
    artist: "The Weeknd",
    albumImageUrl: "https://upload.wikimedia.org/wikipedia/en/3/39/The_Weeknd_-_Starboy.png",
    previewUrl: "/AbaShimonMP3.mp3" // כרגע משתמש באותו קובץ לבדיקה
  },
]

async function main() {
  console.log('🌱 מנקה נתונים ישנים ומכניס שירים ל-MongoDB...');
  await prisma.track.deleteMany({});

  for (const track of VIBE_TRACKS) {
    await prisma.track.create({
      data: track // עכשיו ה-Data תואם ל-Type כי אין id ידני
    });
  }
  console.log('✅ השירים הוכנסו בהצלחה!');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })