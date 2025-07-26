"use client";

import { useState } from "react";
import PrayerTracker from "./PrayerLogic/PrayerTracker";
import FriendsSharing from "./FriendsLogic/FriendsSharing";

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

      <FriendsSharing user={user} selectedDate={selectedDate} />
    </>
  );
}
