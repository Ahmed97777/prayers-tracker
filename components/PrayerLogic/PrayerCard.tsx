import { memo } from "react";
import { DrawerTrigger } from "@/components/ui/drawer";
import { statusStyles } from "@/utils/constants";
import { Prayer } from "@/utils/types";

const PrayerCard = memo(function PrayerCard({
  prayer,
  status,
  loading,
  onSelect,
}: {
  prayer: Prayer;
  status: "ON_TIME" | "LATE" | "JAMAAH" | "UNSET";
  loading: boolean;
  onSelect: () => void;
}) {
  const Icon = prayer.icon;
  const statusInfo = statusStyles[status];
  const StatusIcon = statusInfo.icon;

  const NoStatusInfo = statusStyles["UNSET"];
  const NoStatusIcon = NoStatusInfo.icon;

  const displayStatusInfo = loading ? NoStatusInfo : statusInfo;
  const DisplayStatusIcon = loading ? NoStatusIcon : StatusIcon;

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
              className={`w-8 h-8 rounded-full flex items-center justify-center ${displayStatusInfo.color}`}
            >
              <DisplayStatusIcon size={16} className="text-white" />
            </div>
            <span
              className={`text-sm font-medium ${
                loading ? "text-gray-400" : displayStatusInfo.textColor
              } min-w-[70px]`}
            >
              {loading ? "Loading..." : displayStatusInfo.label}
            </span>
          </div>
        </div>
      </div>
    </DrawerTrigger>
  );
});

export default PrayerCard;
