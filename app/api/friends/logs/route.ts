import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const dateStr = searchParams.get("date");
  if (!userId || !dateStr) return NextResponse.json([]);
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);

  // Get friends
  const friends = await db.friendship.findMany({
    where: { userId },
    include: { friend: true },
  });
  const friendIds = friends.map((f) => f.friend.id);
  if (friendIds.length === 0) return NextResponse.json([]);

  // Get logs for all friends for the date
  const logs = await db.prayerLog.findMany({
    where: {
      userId: { in: friendIds },
      date: { gte: date, lt: tomorrow },
    },
  });

  // Group logs by friend
  const result = friends.map((f) => ({
    friendId: f.friend.id,
    friendName: f.friend.name || f.friend.email,
    logs: logs
      .filter((l) => l.userId === f.friend.id)
      .map((l) => ({ prayerId: l.prayerId, status: l.status })),
  }));
  return NextResponse.json(result);
}