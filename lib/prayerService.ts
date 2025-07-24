'use server'

import db from "@/lib/db";

export async function getTodayPrayerLogs(userId: string) {
  try {
    if (!userId) throw new Error("No user ID provided");

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const prayerLogs = await db.prayerLog.findMany({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    return { prayerLogs };
  } catch (error) {
    console.error("Failed to fetch prayer logs:", error);
    throw new Error("Unable to fetch prayer logs.");
  }
}
