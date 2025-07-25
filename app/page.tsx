import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import PrayerTrackerWithFriends from "@/components/PrayerTrackerWithFriends";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/sign-in");

  return (
    <div className="flex flex-col bg-accent">
      <PrayerTrackerWithFriends user={session.user} />

      <div className="flex justify-center items-center p-2 m-2">
        <Link href={"/history-stats"}>
          <Button variant={"outline"} className="cursor-pointer">
            History with Statistics
          </Button>
        </Link>
      </div>
    </div>
  );
}
