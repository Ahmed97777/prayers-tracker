import db from "@/lib/db";

export async function getPrayersWithLogs(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const prayers = await db.prayer.findMany();
  const prayerLogs = await db.prayerLog.findMany({
    where: {
      userId,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  });
  return { prayers, prayerLogs };
}