import { Prayer, PrayerLog } from "@/utils/types";

export function usePostPrayerStatus(
  userId: string | undefined,
  selectedDate: Date,
  selectedPrayer: Prayer | null,
  status: "ON_TIME" | "LATE" | "JAMAAH",
  setPrayerLogs: React.Dispatch<React.SetStateAction<PrayerLog[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPostError: React.Dispatch<React.SetStateAction<string | null>>,
  setSelectedPrayer: React.Dispatch<React.SetStateAction<Prayer | null>>
) {
    async function postPrayerStatus() {
      if (!selectedPrayer) return;
      setLoading(true);
      setSelectedPrayer(null); // Close drawer
      setPostError(null);

      try {
        const res = await fetch("/api/prayer-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            prayerId: selectedPrayer?.id,
            status,
            date: selectedDate.toLocaleDateString("en-CA"),
          }),
        });
  
        if (!res.ok) {
          throw new Error("Failed to save prayer status.");
        }
  
        const updatedLog = await res.json();
        setPrayerLogs((prev) => {
          const otherLogs = prev.filter(
            (log) => log.prayerId !== selectedPrayer?.id
          );
          return [...otherLogs, updatedLog];
        });
        } catch (e: any) {
        setPostError(`Failed to save prayer status. Please try again.`);
      } finally {
        setLoading(false);
      }
    }

    postPrayerStatus();
}
