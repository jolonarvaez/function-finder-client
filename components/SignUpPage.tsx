"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";

export function SignUpPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  async function signUpWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${globalThis.location.origin}`,
      },
    });
  }

  async function signUpWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim().slice(0, 100) },
      },
    });

    setLoading(false);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        setError("An account with this email already exists.");
      } else if (msg.includes("password")) {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Could not create account. Please try again.");
      }
    } else {
      router.replace("/");
    }
  }

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create Account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Join the nightlife community
        </p>
      </div>

      <form onSubmit={signUpWithEmail} className="mb-6 space-y-4">
        {error && (
          <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="signup-name" className="text-xs text-foreground">
            Full Name
          </Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signup-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-12 rounded-xl pl-10 dark:bg-card"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-email" className="text-xs text-foreground">
            Email Address
          </Label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 rounded-xl pl-10 dark:bg-card"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-password" className="text-xs text-foreground">
            Password
          </Label>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-12 rounded-xl pl-10 pr-10 dark:bg-card"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none active:opacity-70"
            >
              {showPassword ? (
                <EyeOffIcon className="size-4" />
              ) : (
                <EyeIcon className="size-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="outline"
          className="h-12 w-full rounded-xl text-sm font-medium dark:bg-card"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="mb-8 flex justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          title="Sign up with Google"
          className="size-12 rounded-xl"
          aria-label="Sign up with Google"
          onClick={signUpWithGoogle}
        >
          <FaGoogle className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled
          title="Sign up with Facebook"
          className="size-12 rounded-xl"
          aria-label="Sign up with Facebook"
        >
          <FaFacebook className="size-4" />
        </Button>
      </div>

      <div className="mb-6 text-center">
        <span className="text-sm text-muted-foreground">
          Already have an account?{" "}
        </span>
        <Link
          href="/login"
          className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:underline"
        >
          Sign In
        </Link>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to Nyte&apos;s{" "}
        <button
          type="button"
          className="text-primary hover:underline focus-visible:outline-none"
        >
          Terms of Service
        </button>{" "}
        and{" "}
        <button
          type="button"
          className="text-primary hover:underline focus-visible:outline-none"
        >
          Privacy Policy
        </button>
      </p>
    </div>
  );
}
