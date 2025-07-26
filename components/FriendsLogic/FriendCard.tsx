import { memo, useCallback, useMemo, useState } from "react";
import Image from "next/image";
import {
  Moon,
  Sun,
  CloudSun,
  Sunset,
  MoonStar,
  User,
  X,
  Trash2,
} from "lucide-react";
import { Friend, FriendLogSummary } from "@/utils/types";
import { friendsStatusStyles } from "@/utils/constants";
import { Avatar } from "../ui/avatar";

const prayers = [
  { name: "Fajr", icon: Moon, id: 1 },
  { name: "Dhuhr", icon: Sun, id: 2 },
  { name: "Asr", icon: CloudSun, id: 3 },
  { name: "Maghrib", icon: Sunset, id: 4 },
  { name: "Isha", icon: MoonStar, id: 5 },
];

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  friendName,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  friendName: string;
  isLoading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Remove Friend</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Are you sure you want to remove{" "}
            <span className="font-medium text-gray-900">{friendName}</span> from
            your prayer circle?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Removing...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Remove</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const FriendCard = ({
  friend,
  friendLogs,
  onRemove,
  removeLoading,
  isLoadingLogs = false,
}: {
  friend: Friend;
  friendLogs: FriendLogSummary[];
  onRemove: (friendId: string) => void;
  removeLoading: boolean;
  isLoadingLogs?: boolean;
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const friendLog = friendLogs.find((log) => log.friendId === friend.id);

  // Get prayer status for each prayer
  const getPrayerStatus = useCallback(
    (prayerId: number) => {
      if (!friendLog) return null;
      const log = friendLog.logs.find((log) => log.prayerId === prayerId);
      if (!log) return null;

      return log.status.toLowerCase().replace("_", "-");
    },
    [friendLog]
  );

  const completedPrayers = useMemo(
    () => friendLog?.logs.filter((log) => log.status !== "UNSET").length || 0,
    [friendLog]
  );
  const totalPrayers = 5;
  const Icon = User;

  const handleRemoveClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmRemove = () => {
    onRemove(friend.id);
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden">
              {friend.image ? (
                <Avatar className="h-7 w-7">
                  <div className="relative h-7 w-7 rounded-full overflow-hidden">
                    <Image
                      src={friend.image}
                      alt="Friend Image"
                      fill
                      className="object-cover"
                    />
                  </div>
                </Avatar>
              ) : (
                <span className="text-white font-semibold text-sm">
                  <Icon size={16} className={"text-white"} />
                </span>
              )}
            </div>
            <div className="max-w-[140px]">
              <h3
                className="font-semibold text-gray-900 text-sm truncate"
                title={friend.name ? friend.name : friend.email}
              >
                {friend.name ? friend.name : friend.email}
              </h3>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleRemoveClick}
              disabled={removeLoading}
              className="mr-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 cursor-pointer p-1"
              title="Remove friend"
            >
              <X size={16} />
            </button>
            <div className="text-right">
              {isLoadingLogs ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-8 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-900">
                    {completedPrayers}/{totalPrayers}
                  </p>
                  <p className="text-xs text-gray-500">prayers</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between space-x-2">
          {prayers.map((prayer) => {
            const statusKey = getPrayerStatus(prayer.id);
            const statusInfo = statusKey
              ? friendsStatusStyles[
                  statusKey as keyof typeof friendsStatusStyles
                ]
              : null;
            const PrayerIcon = prayer.icon;

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
                  {isLoadingLogs ? (
                    <div className="text-xs text-gray-500 font-medium">...</div>
                  ) : (
                    <PrayerIcon
                      size={16}
                      className={
                        statusInfo ? statusInfo.textColor : "text-gray-400"
                      }
                    />
                  )}
                </div>
                {statusInfo && !isLoadingLogs && (
                  <div
                    className={`w-2 h-2 rounded-full ${statusInfo.color}`}
                  ></div>
                )}
                {isLoadingLogs && (
                  <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmRemove}
        friendName={friend.name || friend.email}
        isLoading={removeLoading}
      />
    </>
  );
};

export default memo(FriendCard);
