"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { loginWithEmail } from "@/lib/services/auth";
import { PageContainer } from "@/components/reusables/PageContainer";

export function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${globalThis.location.origin}/auth/callback`,
        scopes: "openid email profile",
      },
    });
  }

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call the backend for any server-side setup (user record creation, etc.)
      await loginWithEmail(email, password);

      // Sign in with Supabase directly to get a proper, auto-refreshable session.
      // The backend tokens may be short-lived or non-Supabase, so we don't use setSession.
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;

      const userId = signInData.session?.user.id;
      if (!userId) throw new Error("No user ID");

      const { data } = await supabase
        .from("users")
        .select("profile_type")
        .eq("id", userId)
        .single();

      router.replace(data?.profile_type ? "/" : "/onboarding");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer>
      <div className="flex min-h-screen flex-col pb-10 pt-14">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to Function Finder</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Sign in to continue your nightlife journey
          </p>
        </div>

        <form onSubmit={signInWithEmail} className="mb-6 space-y-4">
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-xs text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-email"
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
            <Label htmlFor="login-password" className="text-xs text-foreground">
              Password
            </Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
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
                {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="outline"
            className="h-12 w-full rounded-xl text-sm font-medium dark:bg-card"
          >
            {loading ? "Signing in..." : "Sign In"}
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
            title="Sign in with Google"
            className="size-12 rounded-xl"
            aria-label="Sign in with Google"
            onClick={signInWithGoogle}
          >
            <FaGoogle className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled
            title="Sign in with Facebook"
            className="size-12 rounded-xl"
            aria-label="Sign in with Facebook"
          >
            <FaFacebook className="size-4" />
          </Button>
        </div>

        <div className="mb-6 text-center">
          <span className="text-sm text-muted-foreground">Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:underline"
          >
            Sign Up
          </Link>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to Nyte&apos;s{" "}
          <button type="button" className="text-primary hover:underline focus-visible:outline-none">
            Terms of Service
          </button>{" "}
          and{" "}
          <button type="button" className="text-primary hover:underline focus-visible:outline-none">
            Privacy Policy
          </button>
        </p>
      </div>
    </PageContainer>
  );
}
