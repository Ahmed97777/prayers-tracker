"use client";
import { executeAction } from "@/lib/executeAction";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const credentials = Object.fromEntries(formData.entries());

    const result = await executeAction({
      actionFn: async () => {
        const res = await signIn("credentials", {
          ...credentials,
          redirect: false,
        });
        if (!res || res.error) {
          throw new Error(res?.error || "Invalid credentials");
        }
      },
    });

    // case Invalid credentials
    if (!result.success) {
      setLoading(false);
      setErrorMessage("Invalid credentials.");
    }
    // case valid credentials
    else {
      setLoading(false);
      redirect("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-slate-600">Sign in to your account to continue</p>
        </div>

        {/* Sign-in Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
              <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-900">Sign In</span>
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {errorMessage && (
              <Alert
                variant="destructive"
                className="animate-in slide-in-from-top-1 duration-300"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Sign-in Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400 bg-white text-slate-900 placeholder:text-slate-400"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400 bg-white text-slate-900 placeholder:text-slate-400"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign-up Link */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-slate-900 hover:text-slate-700 transition-colors duration-200 underline underline-offset-4"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}