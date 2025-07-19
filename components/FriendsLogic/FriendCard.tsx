import { Moon, Sun, CloudSun, Sunset, MoonStar, User, X } from "lucide-react";

import { friendsStatusStyles } from "@/utils/constants";
import { Friend, FriendLogSummary } from "@/utils/types";
import { Avatar, AvatarImage } from "../ui/avatar";

const prayers = [
  { name: "Fajr", icon: Moon, id: 1 },
  { name: "Dhuhr", icon: Sun, id: 2 },
  { name: "Asr", icon: CloudSun, id: 3 },
  { name: "Maghrib", icon: Sunset, id: 4 },
  { name: "Isha", icon: MoonStar, id: 5 },
];

const FriendCard = ({
  friend,
  friendLogs,
  onRemove,
  removeLoading,
}: {
  friend: Friend;
  friendLogs: FriendLogSummary[];
  onRemove: (friendId: string) => void;
  removeLoading: boolean;
}) => {
  // Find logs for this specific friend
  const friendLog = friendLogs.find((log) => log.friendId === friend.id);

  // Get prayer status for each prayer
  const getPrayerStatus = (prayerId: number) => {
    if (!friendLog) return null;
    const log = friendLog.logs.find((log) => log.prayerId === prayerId);
    if (!log) return null;

    return log.status.toLowerCase().replace("_", "-");
  };

  // Count completed prayers
  const completedPrayers =
    friendLog?.logs.filter((log) => log.status !== "UNSET").length || 0;
  const totalPrayers = 5;

  const Icon = User;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden">
            {friend.image ? (
              <Avatar className="h-7 w-7">
                <AvatarImage src={friend.image || ""} alt="Profile" />
              </Avatar>
            ) : (
              <span className="text-white font-semibold text-sm">
                <Icon size={16} className="text-white" />
              </span>
            )}
          </div>
          <div className="max-w-[140px]">
            {" "}
            {/* adjust max-width as needed */}
            <h3
              className="font-semibold text-gray-900 text-sm truncate"
              title={friend.name ? friend.name : friend.email}
            >
              {friend.name ? friend.name : friend.email}
            </h3>
            {/* <p className="text-sm text-gray-500 truncate">{friend.email}</p> */}
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => onRemove(friend.id)}
            disabled={removeLoading}
            className="mr-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer"
            title="Remove friend"
          >
            <X size={18} />
          </button>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {completedPrayers}/{totalPrayers}
            </p>
            <p className="text-xs text-gray-500">prayers</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between space-x-2">
        {prayers.map((prayer) => {
          const statusKey = getPrayerStatus(prayer.id);
          const statusInfo = statusKey
            ? friendsStatusStyles[statusKey as keyof typeof friendsStatusStyles]
            : null;
          const Icon = prayer.icon;

          return (
            <div
              key={prayer.name}
              className="flex flex-col items-center space-y-1"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  statusInfo ? statusInfo.bgColor : "bg-gray-100"
                }`}
              >
                <Icon
                  size={16}
                  className={
                    statusInfo ? statusInfo.textColor : "text-gray-400"
                  }
                />
              </div>
              {statusInfo && (
                <div
                  className={`w-2 h-2 rounded-full ${statusInfo.color}`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendCard;
