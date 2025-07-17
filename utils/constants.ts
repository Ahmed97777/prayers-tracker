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

export const friendsStatusStyles = {
  late: {
    color: "bg-red-500",
    icon: Clock,
    label: "Late",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
  },
  "on-time": {
    color: "bg-green-500",
    icon: User,
    label: "On time",
    textColor: "text-green-600",
    bgColor: "bg-green-50",
  },
  jamaah: {
    color: "bg-yellow-500",
    icon: Users,
    label: "In jamaah",
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
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

export const statusConfig = {
  ON_TIME: {
    color: "bg-emerald-500 hover:bg-emerald-600",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    label: User,
    name: "On Time",
  },
  LATE: {
    color: "bg-red-500 hover:bg-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    label: Clock,
    name: "Late",
  },
  JAMAAH: {
    color: "bg-amber-500 hover:bg-amber-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    label: Users,
    name: "Jamaah",
  },
  UNSET: {
    color: "bg-gray-300 hover:bg-gray-400",
    bgColor: "bg-gray-50",
    textColor: "text-gray-500",
    label: Ban,
    name: "Not Set",
  },
};