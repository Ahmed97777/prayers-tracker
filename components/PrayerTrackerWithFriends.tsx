"use client";

import { useState } from "react";
import PrayerTrackerManager from "./PrayerLogic/PrayerTrackerManager";
import FriendsManagerWithShadcn from "./FriendsLogic/FriendsSharing";

interface PrayerTrackerWithFriendsProps {
  prayers: any;
  prayerLogs: any;
  userId: string;
}

export default function PrayerTrackerWithFriends({
  prayers,
  prayerLogs,
  userId,
}: PrayerTrackerWithFriendsProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  return (
    <>
      <PrayerTrackerManager
        prayers={prayers}
        prayerLogs={prayerLogs}
        userId={userId}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <FriendsManagerWithShadcn userId={userId} selectedDate={selectedDate} />
    </>
  );
}
