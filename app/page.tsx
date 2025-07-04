import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPrayersWithLogs } from "../lib/prayerService";
import PrayerTrackerWithFriends from "@/components/PrayerTrackerWithFriends";
import Link from "next/link";
import SignOut from "@/components/auth_comps/SignOut";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/sign-in");
  if (!session || !session.user || !session.user.id) {
    throw new Error("User not authenticated");
  }

  // Fetch prayers and logs for the current user
  const { prayers, prayerLogs } = await getPrayersWithLogs(session.user.id);

  return (
    <div className="flex flex-col bg-accent">
      <PrayerTrackerWithFriends
        prayers={prayers}
        prayerLogs={prayerLogs}
        userId={session.user.id}
      />

      <div className="flex justify-between items-center gap-3 p-2 m-2">
        <Link href={"/history-stats"} className="btn btn-outline">
          <Button variant={"outline"} className="cursor-pointer">
            History with Statistics
          </Button>
        </Link>
        <SignOut />
      </div>
    </div>
  );
}
