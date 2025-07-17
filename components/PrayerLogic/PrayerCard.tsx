import { DrawerTrigger } from "@/components/ui/drawer";
import { statusStyles } from "@/utils/constants";
import { Prayer } from "@/utils/types";

const PrayerCard = ({
  prayer,
  status,
  onSelect,
}: {
  prayer: Prayer;
  status: "ON_TIME" | "LATE" | "JAMAAH" | "UNSET";
  onSelect: () => void;
}) => {
  const Icon = prayer.icon;
  const statusInfo = statusStyles[status];
  const StatusIcon = statusInfo.icon;

  return (
    <DrawerTrigger asChild onClick={onSelect}>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Icon className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {prayer.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${statusInfo.color}`}
            >
              {StatusIcon ? (
                <StatusIcon size={16} className="text-white" />
              ) : null}
            </div>
            <span
              className={`text-sm font-medium ${statusInfo.textColor} min-w-[70px]`}
            >
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>
    </DrawerTrigger>
  );
};

export default PrayerCard;
