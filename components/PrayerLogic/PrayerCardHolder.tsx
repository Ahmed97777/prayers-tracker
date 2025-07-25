import { Dispatch, SetStateAction } from "react";
import { Prayer, PrayerLog } from "@/utils/types";
import PrayerCard from "./PrayerCard";

interface PrayerCardHolderProps {
  prayers: Prayer[];
  prayerLogs: PrayerLog[];
  loading: boolean;
  setPostError: Dispatch<SetStateAction<string | null>>;
  setSelectedPrayer: Dispatch<SetStateAction<Prayer | null>>;
}

export default function PrayerCardHolder({
  prayers,
  prayerLogs,
  loading,
  setPostError,
  setSelectedPrayer,
}: PrayerCardHolderProps) {
  const getStatus = (
    prayerId: number
  ): "ON_TIME" | "LATE" | "JAMAAH" | "UNSET" => {
    const log = prayerLogs.find((log) => log.prayerId === prayerId);
    return log ? log.status : "UNSET";
  };

  const handleCardClick = (prayer: Prayer) => {
    setPostError(null);
    setSelectedPrayer(prayer);
  };

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
}
