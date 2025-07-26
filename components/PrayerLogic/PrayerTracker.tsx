"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
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

const PrayerCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

const PrayerTracker = ({
  user,
  selectedDate,
  setSelectedDate,
}: PrayerTrackerProps) => {
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [prayerLogs, setPrayerLogs] = useState<PrayerLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  const userData = useMemo(
    () => ({
      id: user?.id,
      name: user?.name,
      image: user?.image,
    }),
    [user?.id, user?.name, user?.image]
  );

  useFetchPrayerLogs(
    userData.id,
    selectedDate,
    setPrayerLogs,
    setLoading,
    setError
  );

  const handleStatusSelect = useCallback(
    (status: "ON_TIME" | "LATE" | "JAMAAH") => {
      usePostPrayerStatus(
        userData.id,
        selectedDate,
        selectedPrayer,
        status,
        setPrayerLogs,
        setPostError,
        setSelectedPrayer
      );
    },
    [userData.id, selectedDate, selectedPrayer]
  );

  const weekDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return getWeekDates(today);
  }, []);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const isDrawerOpen = useMemo(() => !!selectedPrayer, [selectedPrayer]);

  const handleDrawerClose = useCallback((isOpen: boolean) => {
    if (!isOpen) setSelectedPrayer(null);
  }, []);

  return (
    <>
      <Drawer open={isDrawerOpen} onOpenChange={handleDrawerClose}>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
          <div className="container mx-auto max-w-md p-4">
            <PrayerHeader
              selectedDate={selectedDate}
              userName={userData.name}
              userImage={userData.image}
            />

            <PrayerWeekNav
              weekDates={weekDates}
              today={today}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            {(error || postError) && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 text-center">
                {error || postError}
              </div>
            )}

            <Suspense
              fallback={
                <div className="space-y-3">
                  {prayers.map((prayer) => (
                    <PrayerCardSkeleton key={`skeleton-${prayer.id}`} />
                  ))}
                </div>
              }
            >
              <PrayerCardHolder
                prayers={prayers}
                prayerLogs={prayerLogs}
                loading={loading}
                setPostError={setPostError}
                setSelectedPrayer={setSelectedPrayer}
              />
            </Suspense>
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
