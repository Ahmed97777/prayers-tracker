import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserCog } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { formatDate, isToday } from "@/utils/functions";

interface PrayerHeaderProps {
  selectedDate: Date;
  userName: string | undefined | null;
  userImage: string | undefined | null;
}

const PrayerHeader = memo(function PrayerHeader({
  selectedDate,
  userName,
  userImage,
}: PrayerHeaderProps) {
  const isTodaySelected = isToday(selectedDate);
  const formattedDate = formatDate(selectedDate);

  return (
    <header className="flex justify-between items-center py-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          {isTodaySelected && "Today, "}
          {formattedDate}
        </h1>

        <div className="flex justify-start items-center max-w-[260px] truncate mt-1">
          <span className="text-sm text-gray-600">Prayer Tracker</span>
          {userName && (
            <span className="text-sm font-medium text-gray-800">
              , {userName}
            </span>
          )}
        </div>
      </div>

      <Link href="/user-profile" className="flex-shrink-0">
        {userImage ? (
          <Avatar className="h-7 w-7">
            <div className="relative h-7 w-7 rounded-full overflow-hidden">
              <Image
                src={userImage}
                alt="Profile"
                fill
                sizes="28px"
                className="object-cover"
                priority
              />
            </div>
          </Avatar>
        ) : (
          <UserCog className="text-gray-600" size={28} />
        )}
      </Link>
    </header>
  );
});

export default PrayerHeader;
