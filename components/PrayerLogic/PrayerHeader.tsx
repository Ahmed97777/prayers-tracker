import Link from "next/link";
import { UserCog } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { formatDate } from "@/utils/functions";

interface PrayerHeaderProps {
  selectedDate: Date;
  userName: string | undefined | null;
  userImage: string | undefined | null;
}

export default function PrayerHeader({
  selectedDate,
  userName,
  userImage,
}: PrayerHeaderProps) {
  return (
    <header className="flex justify-between items-center py-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Today, {formatDate(selectedDate)}
        </h1>
        <div className="flex justify-start items-center max-w-[260px] truncate mt-1">
          <span className="text-sm text-gray-600 ">Prayer Tracker</span>
          {userName && (
            <span className="text-sm font-medium text-gray-800 ">
              , {userName}
            </span>
          )}
        </div>
      </div>
      {userImage ? (
        <Link href={"/user-profile"}>
          <Avatar className="h-7 w-7">
            <AvatarImage
              className="object-cover rounded-full"
              src={userImage || ""}
              alt="Profile"
            />
          </Avatar>
        </Link>
      ) : (
        <Link href={"/user-profile"}>
          <UserCog className="text-gray-600" size={28} />
        </Link>
      )}
    </header>
  );
}
