"use client";

import { useState } from "react";
import FriendsManagerWithShadcn from "./FriendsLogic/FriendsSharing";
import PrayerTracker from "./PrayerLogic/PrayerTracker";

interface PrayerTrackerWithFriendsProps {
  user: any;
}

export default function PrayerTrackerWithFriends({
  user,
}: PrayerTrackerWithFriendsProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  return (
    <>
      <PrayerTracker
        user={user}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <FriendsManagerWithShadcn user={user} selectedDate={selectedDate} />
    </>
  );
}
