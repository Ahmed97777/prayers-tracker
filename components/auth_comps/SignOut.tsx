"use client";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { DoorOpen } from "lucide-react";
import { Button } from "../ui/button";

const SignOut = () => {
  const [loading, setLoading] = useState(false);
  const Icon = DoorOpen;

  async function handleSignOut() {
    setLoading(true);
    try {
      await signOut({
        callbackUrl: "/sign-in",
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={"destructive"}
      className="cursor-pointer"
      onClick={handleSignOut}
    >
      {loading ? (
        "Signing Out..."
      ) : (
        <div className="flex justify-center items-center gap-2">
          Sign Out
          <Icon className="text-white" size={24} />
        </div>
      )}
    </Button>
  );
};

export default SignOut;
