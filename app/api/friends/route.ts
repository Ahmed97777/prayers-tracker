import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

// List friends
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json([]);
  const friends = await db.friendship.findMany({
    where: { userId },
    include: { friend: true },
  });
  return NextResponse.json(
    friends.map((f) => ({
      id: f.friend.id,
      name: f.friend.name,
      email: f.friend.email,
    }))
  );
}

// Add friend by email
export async function POST(req: NextRequest) {
  const { userId, email } = await req.json();
  if (!userId || !email)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const friend = await db.user.findUnique({ where: { email } });
  if (!friend)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (friend.id === userId)
    return NextResponse.json({ error: "Cannot add yourself" }, { status: 400 });
  const existingFriendship = await db.friendship.findUnique({
    where: { userId_friendId: { userId, friendId: friend.id } },
  });

  if (existingFriendship) {
    return NextResponse.json(
      { error: "This user is already in your friends list" },
      { status: 409 }
    );
  }
  await db.friendship.upsert({
    where: { userId_friendId: { userId, friendId: friend.id } },
    update: {},
    create: { userId, friendId: friend.id },
  });
  // Return updated friends list
  const friends = await db.friendship.findMany({
    where: { userId },
    include: { friend: true },
  });
  return NextResponse.json(
    friends.map((f) => ({
      id: f.friend.id,
      name: f.friend.name,
      email: f.friend.email,
    }))
  );
}

// Remove friend
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const friendId = searchParams.get("friendId");
  if (!userId || !friendId)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  await db.friendship.deleteMany({ where: { userId, friendId } });
  // Return updated friends list
  const friends = await db.friendship.findMany({
    where: { userId },
    include: { friend: true },
  });
  return NextResponse.json(
    friends.map((f) => ({
      id: f.friend.id,
      name: f.friend.name,
      email: f.friend.email,
    }))
  );
}