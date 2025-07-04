"use client";

import { Moon } from "lucide-react";

import {
  DatabasePrayer,
  DatabasePrayerLog,
  Prayer,
  prayerIconMap,
  PrayerLog,
} from "@/utils/constants";
import PrayerTracker from "./PrayerTracker";

// Component that accepts props from your home page
export default function PrayerTrackerManager({
  prayers: dbPrayers,
  prayerLogs: dbPrayerLogs,
  userId,
  selectedDate,
  setSelectedDate,
}: {
  prayers: DatabasePrayer[];
  prayerLogs: DatabasePrayerLog[];
  userId: string;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) {
  // Convert database prayers to component prayers (add icons)
  const prayers: Prayer[] = dbPrayers.map((prayer) => ({
    ...prayer,
    icon: prayerIconMap[prayer.name] || Moon, // Default to Moon if no icon found
  }));

  // Convert database prayer logs to component prayer logs (remove extra fields)
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
      prayers={prayers}
      prayerLogs={prayerLogs}
      userId={userId}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  );
}
