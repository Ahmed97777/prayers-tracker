"use client";

import PrayerTracker from "./PrayerTracker";
import { DatabasePrayerLog, Prayer, PrayerLog } from "@/utils/types";
import { User } from "next-auth";

export default function PrayerTrackerManager({
  prayerLogs: dbPrayerLogs,
  user,
  selectedDate,
  setSelectedDate,
}: {
  prayerLogs: DatabasePrayerLog[];
  user: User;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) {
  const prayerLogs: PrayerLog[] = dbPrayerLogs
    .filter((log) => {
      const logDate = new Date(log.date);
      const selectedDateOnly = new Date(selectedDate);
      logDate.setHours(0, 0, 0, 0);
      selectedDateOnly.setHours(0, 0, 0, 0);
      return logDate.getTime() === selectedDateOnly.getTime();
    })
    .map((log) => ({
      id: log.id,
      prayerId: log.prayerId,
      status: log.status,
    }));

  return (
    <PrayerTracker
      prayerLogs={prayerLogs}
      user={user}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  );
}
