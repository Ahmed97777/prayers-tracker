"use client";
import { useState } from "react";
import { signUpAction } from "@/lib/actions";
import { redirect } from "next/navigation";
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
import { AlertCircle, Loader2, Mail, Lock, UserPlus } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setLoading(false);
      setErrorMessage("Passwords do not match");
      return;
    }

    const res = await signUpAction(formData);

    if (res.success) {
      setLoading(false);
      redirect("/sign-in");
    } else {
      setLoading(false);
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Create account</h1>
          <p className="text-slate-600">
            Sign up to get started with your account
          </p>
        </div>

        {/* Sign-up Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
              <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-900">Sign Up</span>
            </CardTitle>
            <CardDescription className="text-center text-slate-600">
              Create your account to get started
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

            {/* Sign-up Form */}
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
                <Label className="text-xs font-medium text-slate-500">
                  (Min 8 characters, with one uppercase letter and one number.)
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400 bg-white text-slate-900 placeholder:text-slate-400"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-700"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
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
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign-in Link */}
        <div className="text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-medium text-slate-900 hover:text-slate-700 transition-colors duration-200 underline underline-offset-4"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}