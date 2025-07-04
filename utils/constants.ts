import {
  Moon,
  Sun,
  CloudSun,
  Sunset,
  MoonStar,
  Clock,
  User,
  Users,
  Ban,
  Clock4,
} from "lucide-react";

export type Prayer = {
  id: number;
  name: string;
  icon: any;
};

export type PrayerLog = {
  id: number;
  prayerId: number;
  status: "ON_TIME" | "LATE" | "JAMAAH";
};

export type DatabasePrayerLog = {
  id: number;
  userId: string;
  prayerId: number;
  date: Date;
  status: "ON_TIME" | "LATE" | "JAMAAH";
};

export type DatabasePrayer = {
  id: number;
  name: string;
};

// Default prayers with icons (can be overridden by props)
export const defaultPrayers = [
  { id: 1, name: "Fajr", icon: Moon },
  { id: 2, name: "Dhuhr", icon: Sun },
  { id: 3, name: "Asr", icon: CloudSun },
  { id: 4, name: "Maghrib", icon: Sunset },
  { id: 5, name: "Isha", icon: MoonStar },
];

// Icon mapping for prayers
export const prayerIconMap: { [key: string]: any } = {
  Fajr: Moon,
  Dhuhr: Sun,
  Asr: CloudSun,
  Maghrib: Sunset,
  Isha: MoonStar,
};

export const statusStyles = {
  LATE: {
    color: "bg-red-500",
    icon: Clock,
    label: "Late",
    textColor: "text-red-600",
  },
  ON_TIME: {
    color: "bg-green-500",
    icon: User,
    label: "On time",
    textColor: "text-green-600",
  },
  JAMAAH: {
    color: "bg-yellow-500",
    icon: Users,
    label: "In jamaah",
    textColor: "text-yellow-600",
  },
  UNSET: {
    color: "bg-gray-200",
    icon: Ban,
    label: "Unmarked",
    textColor: "text-gray-400",
  },
};

export const prayerStatusOptions = [
  {
    id: "LATE" as const,
    label: "Late",
    icon: Clock4,
    color: "hover:bg-red-50 hover:border-red-200",
  },
  {
    id: "ON_TIME" as const,
    label: "On time",
    icon: User,
    color: "hover:bg-green-50 hover:border-green-200",
  },
  {
    id: "JAMAAH" as const,
    label: "In jamaah",
    icon: Users,
    color: "hover:bg-yellow-50 hover:border-yellow-200",
  },
];