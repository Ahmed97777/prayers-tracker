import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignUp from "@/components/auth_comps/SignUp";

const page = async () => {
  const session = await auth();
  if (session) redirect("/");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 px-4">
      <div className="w-full max-w-md">
        <div className="card bg-gray-100 shadow-xl p-6">
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default page;
