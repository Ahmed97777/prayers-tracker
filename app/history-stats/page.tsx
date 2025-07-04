import History from "@/components/History&Statistics/History";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <>
      <div className="p-2 m-2">
        <Link href={"/"}>
          <Button variant={"outline"} className="cursor-pointer">
            Go Back
          </Button>
        </Link>
      </div>

      {session?.user?.id && <History userId={session.user.id} />}
    </>
  );
};

export default page;
