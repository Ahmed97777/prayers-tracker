export function getWeekDates(centerDate: Date) {
  const start = new Date(centerDate);
  start.setDate(centerDate.getDate() - 6); // Start 6 days before the center
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export const getCompletionBadgeColor = (percentage: number) => {
  if (percentage >= 80) return "bg-emerald-100 text-emerald-800";
  if (percentage >= 60) return "bg-amber-100 text-amber-800";
  if (percentage >= 40) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
};

export const formatDate = (date: Date) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

export const memberFor = (date: Date | string) => {
  const createdAt = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - createdAt.getTime();
  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  return `Member for ${days} day${days !== 1 ? "s" : ""}`;
};

export const historyFormatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  // date.setDate(date.getDate() + 1);

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};