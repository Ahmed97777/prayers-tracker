import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { userId, prayerId, status, date } = await req.json();
    if (!userId || !prayerId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    // const logDate = date ? new Date(date) : new Date();
    // logDate.setHours(0, 0, 0, 0);

    const [year, month, day] = date.split("-").map(Number);
    const logDate = new Date(year, month - 1, day); // No timezone shift

    const log = await db.prayerLog.upsert({
      where: {
        userId_prayerId_date: {
          userId,
          prayerId,
          date: logDate,
        },
      },
      update: { status },
      create: {
        userId,
        prayerId,
        date: logDate,
        status,
      },
    });
    return NextResponse.json(log);
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const dateStr = searchParams.get("date");
  if (!userId || !dateStr) {
    return NextResponse.json([], { status: 200 });
  }
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);
  const logs = await db.prayerLog.findMany({
    where: {
      userId,
      date: {
        gte: date,
        lt: tomorrow,
      },
    },
  });
  return NextResponse.json(logs);
}