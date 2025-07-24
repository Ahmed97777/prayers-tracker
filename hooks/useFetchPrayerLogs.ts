import { useEffect } from "react";
import { PrayerLog } from "@/utils/types";

export function useFetchPrayerLogs(
  userId: string | undefined,
  selectedDate: Date,
  setPrayerLogs: React.Dispatch<React.SetStateAction<PrayerLog[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  useEffect(() => {
    async function fetchLogs() {
      if (!userId || !selectedDate) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/prayer-logs?userId=${userId}&date=${selectedDate.toLocaleDateString(
            "en-CA"
          )}`
        );

        if (!res.ok) throw new Error("Failed to fetch prayer logs.");

        const logs = await res.json();
        setPrayerLogs(logs);
      } catch (err) {
        setError("Could not load prayer logs. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [userId, selectedDate]);
}
