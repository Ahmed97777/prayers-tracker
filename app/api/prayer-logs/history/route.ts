import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "7");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Validate date range
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }

  try {
    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build date filter
    let dateFilter: { gte?: Date; lte?: Date } = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateFilter = { gte: start, lte: end };
    }

    // Single optimized query to get all data at once
    const [friendsWithLogs, prayers, uniqueDatesCount] = await Promise.all([
      // Get friends and their prayer logs in one query
      db.friendship.findMany({
        where: { userId },
        include: {
          friend: {
            include: {
              prayerLogs: {
                where: {
                  ...(Object.keys(dateFilter).length > 0 && {
                    date: dateFilter,
                  }),
                },
                orderBy: [{ date: "desc" }, { prayerId: "asc" }],
              },
            },
          },
        },
      }),

      // Get prayers reference
      db.prayer.findMany({
        orderBy: { id: "asc" },
      }),

      // Get total unique dates count for pagination
      db.prayerLog
        .groupBy({
          by: ["date"],
          where: {
            OR: [
              { userId },
              {
                userId: {
                  in: await db.friendship
                    .findMany({
                      where: { userId },
                      select: { friendId: true },
                    })
                    .then((friends) => friends.map((f) => f.friendId)),
                },
              },
            ],
            ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
          },
        })
        .then((groups) => groups.length),
    ]);

    // Get user's own logs
    const userLogs = await db.prayerLog.findMany({
      where: {
        userId,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
      },
      orderBy: [{ date: "desc" }, { prayerId: "asc" }],
    });

    // Get all unique dates from both user and friends logs
    const allDates = new Set<string>();

    // Add user log dates
    userLogs.forEach((log) => {
      allDates.add(log.date.toISOString().split("T")[0]);
    });

    // Add friends log dates
    friendsWithLogs.forEach((friendship) => {
      friendship.friend.prayerLogs.forEach((log) => {
        allDates.add(log.date.toISOString().split("T")[0]);
      });
    });

    // Sort dates and apply pagination
    const sortedDates = Array.from(allDates)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .slice(skip, skip + limit);

    // Group data by the paginated dates
    const groupedData = sortedDates.map((dateStr) => {
      // User's logs for this date
      const userLogsForDate = userLogs
        .filter((log) => log.date.toISOString().split("T")[0] === dateStr)
        .map((log) => ({
          prayerId: log.prayerId,
          status: log.status,
        }));

      // Friends' logs for this date
      const friendsData = friendsWithLogs.map((friendship) => {
        const friendLogsForDate = friendship.friend.prayerLogs
          .filter((log) => log.date.toISOString().split("T")[0] === dateStr)
          .map((log) => ({
            prayerId: log.prayerId,
            status: log.status,
          }));

        return {
          friendId: friendship.friend.id,
          friendName: friendship.friend.name || friendship.friend.email,
          logs: friendLogsForDate,
        };
      });

      return {
        date: dateStr,
        user: {
          logs: userLogsForDate,
        },
        friends: friendsData,
      };
    });

    return NextResponse.json({
      data: groupedData,
      prayers,
      pagination: {
        page,
        limit,
        total: uniqueDatesCount,
        totalPages: Math.ceil(uniqueDatesCount / limit),
        hasNext: page < Math.ceil(uniqueDatesCount / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching prayer history:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}