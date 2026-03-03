// app/api/tracks/[id]/route.ts
import { NextResponse } from 'next/server';
//עדכון בגלל הורדה דרגת הקובץ
//import { INITIAL_TRACKS } from '../../data/tracks';
import { INITIAL_TRACKS } from '../../../data/tracks';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // הגדרה כ-Promise
) {
  // כאן בעתיד נמשוך נתונים מבסיס נתונים (Database)
  // כרגע אנחנו מחזירים את הנתונים הסטטיים שלנו
  //try {
  // מחכים לפרמטרים שיגיעו
  const { id } = await params; // המתנה לפרמטרים
  // חילוץ ה-ID מהפרמטרים והפיכתו למספר
  const trackId = parseInt(id);
  
  // חיפוש השיר במערך הנתונים שלנו
  const track = INITIAL_TRACKS.find(t => t.id === trackId);

  // אם השיר לא נמצא, נחזיר שגיאת 404
  if (!track) {
    return NextResponse.json(
      { error: "השיר לא נמצא במערכת" }, 
      { status: 404 }
    );
  }

  // החזרת השיר שנמצא בפורמט JSON
  return NextResponse.json(track);
  //} catch (error) {
  //  return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  //}
}