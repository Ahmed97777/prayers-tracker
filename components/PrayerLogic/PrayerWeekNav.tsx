import { memo } from "react";
import DayButton from "./DayButton";

interface PrayerWeekNavProps {
  weekDates: Date[];
  today: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const PrayerWeekNav = memo(function PrayerWeekNav({
  weekDates,
  today,
  selectedDate,
  setSelectedDate,
}: PrayerWeekNavProps) {
  return (
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
  );
});

export default PrayerWeekNav;
