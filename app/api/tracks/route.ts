// app/api/tracks/route.ts
import { NextResponse } from 'next/server';
// שימוש בנתיב יחסי כדי לעקוף את בעיית ה-TypeScript
import { prisma } from "@/lib/db"; // ייבוא של ה-client שיצרנו
import { INITIAL_TRACKS } from '../../data/tracks'; // וודא שהנתיב נכון

//לפי השיטה הישנה מהקובץ data
/*export async function GET() {
  // נתיב זה מחזיר תמיד את כל הרשימה
  return NextResponse.json(INITIAL_TRACKS);
}*/

export async function GET() {
  try {
    // שליפת כל השירים מה-MongoDB האמיתי
    const tracks = await prisma.track.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tracks);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "נכשל בטעינת השירים" }, { status: 500 });
  }
}

// הוספת שיר חדש
// לפי השיטה הישנה בלי חיבור ל DB
/*export async function POST(request: Request) {
  try {
    const body = await request.json(); // קריאת הנתונים שנשלחו מהפרונטנד
    
    // יצירת אובייקט שיר חדש
    const newTrack = {
      id: INITIAL_TRACKS.length + 1, // ייצור ID פשוט
      title: body.title,
      artist: body.artist,
      albumImageUrl: body.albumImageUrl || "https://via.placeholder.com/300",
      previewUrl: body.previewUrl
    };

    // הוספה למערך (בזיכרון בלבד כרגע)
    INITIAL_TRACKS.push(newTrack);

    return NextResponse.json(newTrack, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "שגיאה בהוספת השיר" }, { status: 400 });
  }
}*/

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // יצירת רשומה חדשה ב-MongoDB
    const newTrack = await prisma.track.create({
      data: {
        title: body.title,
        artist: body.artist,
        albumImageUrl: body.albumImageUrl || "https://via.placeholder.com/300",
        previewUrl: body.previewUrl,
      },
    });

    return NextResponse.json(newTrack, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "שגיאה בשמירת השיר בבסיס הנתונים" }, { status: 400 });
  }
}

// הוסף את זה לקובץ app/api/tracks/route.ts (לצד ה-GET וה-POST)

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: "Missing ID" }, { status: 400 });
    }

    await prisma.track.delete({
      where: { id: id },
    });

    return Response.json({ message: "Track deleted successfully" });
  } catch (error) {
    return Response.json({ error: "Failed to delete track" }, { status: 500 });
  }
}