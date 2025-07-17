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

export type HistoryLog = {
  prayerId: number;
  status: "ON_TIME" | "LATE" | "JAMAAH";
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

export type DatabasePrayer = {
  id: number;
  name: string;
};

export type DatabasePrayerLog = {
  id: number;
  userId: string;
  prayerId: number;
  date: Date;
  status: "ON_TIME" | "LATE" | "JAMAAH";
};