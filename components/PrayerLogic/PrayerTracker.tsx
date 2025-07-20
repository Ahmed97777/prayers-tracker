import { defaultPrayers, prayerStatusOptions } from "@/utils/constants";
import PrayerCard from "./PrayerCard";
import { formatDate, getWeekDates } from "@/utils/functions";
import { useEffect, useState } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import DayButton from "./DayButton";
import { Prayer, PrayerLog } from "@/utils/types";
import { UserCog } from "lucide-react";
import Link from "next/link";
import { User } from "next-auth";
import { Avatar, AvatarImage } from "../ui/avatar";

interface PrayerTrackerProps {
  prayers: Prayer[];
  prayerLogs: PrayerLog[];
  user: User;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const PrayerTracker = ({
  prayers = defaultPrayers,
  prayerLogs: initialPrayerLogs = [],
  user,
  selectedDate,
  setSelectedDate,
}: Partial<PrayerTrackerProps> & {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}) => {
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [prayerLogs, setPrayerLogs] = useState(initialPrayerLogs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);
  const [userId] = useState<string | undefined>(user?.id);
  const [userName] = useState<string | undefined | null>(user?.name);
  const [userImage] = useState<string | undefined | null>(user?.image);

  // Fetch logs when selectedDate changes
  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/prayer-logs?userId=${userId}&date=${selectedDate.toLocaleDateString(
            "en-CA"
          )}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch prayer logs.");
        }
        const logs = await res.json();
        setPrayerLogs(logs);
      } catch (err) {
        setError("Could not load prayer logs. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [selectedDate, userId]);

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

  const handleStatusSelect = async (status: "ON_TIME" | "LATE" | "JAMAAH") => {
    if (!selectedPrayer) return;
    setLoading(true);
    setPostError(null);

    try {
      const res = await fetch("/api/prayer-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          prayerId: selectedPrayer.id,
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
          (log) => log.prayerId !== selectedPrayer.id
        );
        return [...otherLogs, updatedLog];
      });

      setSelectedPrayer(null); // Close drawer on success
    } catch (e: any) {
      setPostError("Failed to save prayer status. Please try again.");
    } finally {
      setLoading(false);
    }
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
            {/* Header */}
            <header className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Today, {formatDate(selectedDate)}
                </h1>
                <div className="flex justify-start items-center max-w-[260px] truncate mt-1">
                  <span className="text-sm text-gray-600 ">Prayer Tracker</span>
                  {userName && (
                    <span className="text-sm font-medium text-gray-800 ">
                      , {userName}
                    </span>
                  )}
                </div>
              </div>
              {userImage ? (
                <Link href={"/user-profile"}>
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      className="object-cover rounded-full"
                      src={userImage || ""}
                      alt="Profile"
                    />
                  </Avatar>
                </Link>
              ) : (
                <Link href={"/user-profile"}>
                  <UserCog className="text-gray-600" size={28} />
                </Link>
              )}
            </header>

            {/* Week Navigation */}
            <div className="mb-8">
              <div className="flex justify-between space-x-1">
                {weekDates.map((date) => {
                  const isToday = date.getTime() === today.getTime();
                  const isSelected = date.getTime() === selectedDate.getTime();
                  return (
                    <DayButton
                      key={date.toISOString()}
                      day={date
                        .toLocaleDateString(undefined, { weekday: "short" })
                        .toUpperCase()}
                      date={date.getDate()}
                      selected={isSelected}
                      isToday={isToday}
                      onClick={() => setSelectedDate(new Date(date))}
                    />
                  );
                })}
              </div>
            </div>

            {/* Error when fetching logs */}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4 text-center">
                {error}
              </div>
            )}

            {/* Prayers Section */}
            <div>
              <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
                Today's Prayers
              </h2>
              <div className="space-y-3">
                {prayers.map((prayer) => (
                  <PrayerCard
                    key={prayer.id}
                    prayer={prayer}
                    status={getStatus(prayer.id)}
                    onSelect={() => handleCardClick(prayer)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Content */}
        <DrawerContent className="max-w-md mx-auto">
          <DrawerHeader className="pb-4">
            {selectedPrayer && (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <selectedPrayer.icon size={32} className="text-blue-600" />
                </div>
                <DrawerTitle className="text-xl font-bold text-gray-900">
                  {selectedPrayer.name} Prayer
                </DrawerTitle>
                <DrawerDescription className="text-gray-600 mt-2">
                  How did you complete your {selectedPrayer.name} prayer today?
                </DrawerDescription>
              </div>
            )}
          </DrawerHeader>

          <div className="px-4 pb-6">
            {loading && (
              <div className="flex justify-center mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            )}

            {postError && (
              <div className="text-sm text-red-600 bg-red-100 p-2 rounded mb-4 text-center">
                {postError}
              </div>
            )}

            <div className="space-y-2">
              {prayerStatusOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleStatusSelect(option.id)}
                  disabled={loading}
                  className={`w-full flex items-center p-4 rounded-xl border border-gray-200 text-left transition-all duration-200 ${option.color} disabled:opacity-50`}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <option.icon className="text-gray-600" size={20} />
                  </div>
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default PrayerTracker;
