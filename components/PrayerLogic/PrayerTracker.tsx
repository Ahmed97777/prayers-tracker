"use client";

import { useState } from "react";
import { User } from "next-auth";
import { Drawer } from "@/components/ui/drawer";
import PrayerHeader from "./PrayerHeader";
import PrayerWeekNav from "./PrayerWeekNav";
import PrayerCardHolder from "./PrayerCardHolder";
import DrawerMainLogic from "./DrawerMainLogic";
import { useFetchPrayerLogs } from "@/hooks/useFetchPrayerLogs";
import { usePostPrayerStatus } from "@/hooks/usePostPrayerStatus";
import { Prayer, PrayerLog } from "@/utils/types";
import { defaultPrayers } from "@/utils/constants";
import { getWeekDates } from "@/utils/functions";

const prayers: Prayer[] = defaultPrayers;

interface PrayerTrackerProps {
  user: User;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const PrayerTracker = ({
  user,
  selectedDate,
  setSelectedDate,
}: PrayerTrackerProps & {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) => {
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [prayerLogs, setPrayerLogs] = useState<PrayerLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);
  const userId: string | undefined = user?.id;
  const userName: string | undefined | null = user?.name;
  const userImage: string | undefined | null = user?.image;

  // Fetch logs when selectedDate changes
  useFetchPrayerLogs(userId, selectedDate, setPrayerLogs, setLoading, setError);

  const handleStatusSelect = (status: "ON_TIME" | "LATE" | "JAMAAH") => {
    usePostPrayerStatus(
      userId,
      selectedDate,
      selectedPrayer,
      status,
      setPrayerLogs,
      setPostError,
      setSelectedPrayer
    );
  };

  // Calendar strip
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekDates = getWeekDates(today);

  return (
    <>
      <Drawer
        open={!!selectedPrayer}
        onOpenChange={(isOpen) => !isOpen && setSelectedPrayer(null)}
      >
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
          <div className="container mx-auto max-w-md p-4">
            <PrayerHeader
              selectedDate={selectedDate}
              userName={userName}
              userImage={userImage}
            />

            <PrayerWeekNav
              weekDates={weekDates}
              today={today}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            {error || postError ? (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 text-center">
                {error || postError}
              </div>
            ) : null}

            <PrayerCardHolder
              prayers={prayers}
              prayerLogs={prayerLogs}
              loading={loading}
              setPostError={setPostError}
              setSelectedPrayer={setSelectedPrayer}
            />
          </div>
        </div>

        <DrawerMainLogic
          selectedPrayer={selectedPrayer}
          handleStatusSelect={handleStatusSelect}
        />
      </Drawer>
    </>
  );
};

export default PrayerTracker;
