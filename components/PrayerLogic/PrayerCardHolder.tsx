import { Dispatch, SetStateAction, memo, useMemo, useCallback } from "react";
import { Prayer, PrayerLog } from "@/utils/types";
import PrayerCard from "./PrayerCard";

interface PrayerCardHolderProps {
  prayers: Prayer[];
  prayerLogs: PrayerLog[];
  loading: boolean;
  setPostError: Dispatch<SetStateAction<string | null>>;
  setSelectedPrayer: Dispatch<SetStateAction<Prayer | null>>;
}

const PrayerCardHolder = memo(function PrayerCardHolder({
  prayers,
  prayerLogs,
  loading,
  setPostError,
  setSelectedPrayer,
}: PrayerCardHolderProps) {
  const statusMap = useMemo(() => {
    const map = new Map<number, "ON_TIME" | "LATE" | "JAMAAH" | "UNSET">();
    prayerLogs.forEach((log) => {
      map.set(log.prayerId, log.status);
    });
    return map;
  }, [prayerLogs]);

  const getStatus = useCallback(
    (prayerId: number) => {
      return statusMap.get(prayerId) || "UNSET";
    },
    [statusMap]
  );

  const handleCardClick = useCallback(
    (prayer: Prayer) => {
      setPostError(null);
      setSelectedPrayer(prayer);
    },
    [setPostError, setSelectedPrayer]
  );

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
        Today's Prayers
      </h2>
      <div className="space-y-3">
        {prayers.map((prayer) => (
          <PrayerCard
            key={prayer.id}
            prayer={prayer}
            loading={loading}
            status={getStatus(prayer.id)}
            onSelect={() => handleCardClick(prayer)}
          />
        ))}
      </div>
    </div>
  );
});

export default PrayerCardHolder;
