import Profile from "@/components/profileLogic/Profile";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Profile session={session as any} className="mb-8" />
    </div>
  );
}
