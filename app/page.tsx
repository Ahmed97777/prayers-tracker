import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { getTodayPrayerLogs } from "@/lib/prayerService";
import PrayerTrackerWithFriends from "@/components/PrayerTrackerWithFriends";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/sign-in");
  if (!session.user || !session.user.id) {
    throw new Error("User not authenticated");
  }

  try {
    const { prayerLogs } = await getTodayPrayerLogs(session.user.id);

    return (
      <div className="flex flex-col bg-accent">
        <PrayerTrackerWithFriends prayerLogs={prayerLogs} user={session.user} />

        <div className="flex justify-center items-center p-2 m-2">
          <Link href={"/history-stats"}>
            <Button variant={"outline"} className="cursor-pointer">
              History with Statistics
            </Button>
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading prayers and logs:", error);
    return (
      <div className="p-4 text-red-600">
        <p>
          Something went wrong while loading your data. Please try again later.
        </p>
      </div>
    );
  }
}
