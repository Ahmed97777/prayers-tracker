"use client";

import { useState } from "react";
import PrayerTrackerManager from "./PrayerLogic/PrayerTrackerManager";
import FriendsManagerWithShadcn from "./FriendsLogic/FriendsSharing";
import { User } from "next-auth";

interface PrayerTrackerWithFriendsProps {
  prayerLogs: any;
  user: User;
}

export default function PrayerTrackerWithFriends({
  prayerLogs,
  user,
}: PrayerTrackerWithFriendsProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  return (
    <>
      <PrayerTrackerManager
        prayerLogs={prayerLogs}
        user={user}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <FriendsManagerWithShadcn user={user} selectedDate={selectedDate} />
    </>
  );
}
