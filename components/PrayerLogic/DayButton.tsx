const DayButton = ({
  day,
  date,
  selected,
  isToday,
  onClick,
}: {
  day: string;
  date: number;
  selected?: boolean;
  isToday?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-12 h-16 rounded-xl transition-all duration-200 cursor-pointer ${
      selected
        ? "bg-blue-600 text-white shadow-lg scale-105"
        : isToday
        ? "bg-blue-100 text-blue-700 shadow-sm border border-blue-200"
        : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-100"
    }`}
  >
    <span className="text-xs font-medium">{day}</span>
    <span className="text-lg font-bold mt-1">{date}</span>
  </button>
);

export default DayButton;
