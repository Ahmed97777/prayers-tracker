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

export type Friend = {
  id: string;
  name: string;
  email: string;
};

export type FriendLogSummary = {
  friendId: string;
  friendName: string;
  logs: { prayerId: number; status: string }[];
};

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

export type HistoryLog = {
  prayerId: number;
  status: "ON_TIME" | "LATE" | "JAMAAH";
};

export type FriendData = {
  friendId: string;
  friendName: string;
  logs: HistoryLog[];
};

export type DayData = {
  date: string;
  user: {
    logs: HistoryLog[];
  };
  friends: FriendData[];
};

export type HistoryResponse = {
  data: DayData[];
  prayers: Prayer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

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

export const getCompletionBadgeColor = (percentage: number) => {
  if (percentage >= 80) return "bg-emerald-100 text-emerald-800";
  if (percentage >= 60) return "bg-amber-100 text-amber-800";
  if (percentage >= 40) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
};

export interface StatusStats {
  count: number;
  percentage: number;
}

export interface DayCompletion {
  date: string;
  completion: number;
}

export interface Statistics {
  totalPrayers: number;
  onTime: StatusStats;
  late: StatusStats;
  jamaah: StatusStats;
  unset: StatusStats;
  overallCompletion: number;
  dailyAverage: number;
  totalDays: number;
}

export interface PrayerStatisticsProps {
  historyData: DayData[];
  prayers: Prayer[];
}

export interface LeaderboardEntry {
  name: string;
  points: number;
  isCurrentUser: boolean;
}