"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, UserIcon, XIcon } from "lucide-react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserStore } from "@/components/auth/use-user-store";
import { loginWithEmail } from "@/lib/services/auth";
import { PageContainer } from "./reusables/PageContainer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export function SignUpPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserStore();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [emailTouched, setEmailTouched] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [passwordTouched, setPasswordTouched] = React.useState(false);
  const [confirm, setConfirm] = React.useState("");
  const [confirmTouched, setConfirmTouched] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && !profileLoading && user) {
      router.replace(profile?.profile_type ? "/" : "/onboarding");
    }
  }, [user, authLoading, profile, profileLoading, router]);

  const emailInvalid = emailTouched && email.length > 0 && !EMAIL_RE.test(email);
  const passwordRules = PASSWORD_RULES.map((r) => ({ ...r, passing: r.test(password) }));
  const passwordValid = passwordRules.every((r) => r.passing);
  const confirmMismatch = confirmTouched && confirm.length > 0 && confirm !== password;

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

    // Client-side validation before hitting the network
    if (!EMAIL_RE.test(email.trim())) {
      setEmailTouched(true);
      return;
    }
    if (!passwordValid) {
      setPasswordTouched(true);
      return;
    }
    if (confirm !== password) {
      setConfirmTouched(true);
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim().slice(0, 100) },
      },
    });

    if (signUpError) {
      setLoading(false);
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already exists")) {
        setError("An account with this email already exists.");
      } else {
        setError("Could not create account. Please try again.");
      }
      return;
    }

    // Call the backend to create the user record there.
    // Without this, onboarding's updateUser call would fail (backend has no user).
    // We intentionally do NOT call setSession with backend tokens — the valid Supabase
    // session from signUp above is already set and properly refreshable.
    try {
      await loginWithEmail(email.trim(), password);
    } catch {
      // Backend login failed — user record may not exist yet.
      // The user will land on onboarding; if updateUser fails there, they'll see an error.
    } finally {
      setLoading(false);
    }
    // Navigation is handled by the useEffect above once the auth state updates.
  }

  return (
    <PageContainer>
      <div className="flex min-h-screen flex-col pb-10 pt-14">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Account</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Join the nightlife community</p>
        </div>

        <form onSubmit={signUpWithEmail} className="mb-6 space-y-4">
          {error && (
            <p
              role="alert"
              className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {/* Full Name */}
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

          {/* Email */}
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
                onBlur={() => setEmailTouched(true)}
                placeholder="you@example.com"
                aria-invalid={emailInvalid}
                className={`h-12 rounded-xl pl-10 dark:bg-card ${emailInvalid ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
            </div>
            {emailInvalid && (
              <p className="text-xs text-destructive">Enter a valid email address.</p>
            )}
          </div>

          {/* Password */}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                placeholder="••••••••"
                aria-invalid={passwordTouched && !passwordValid}
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
            {/* Password rules — shown once the user starts typing */}
            {password.length > 0 && (
              <ul className="space-y-1 pt-1">
                {passwordRules.map((rule) => (
                  <li key={rule.label} className="flex items-center gap-1.5 text-xs">
                    {rule.passing ? (
                      <CheckIcon className="size-3.5 text-green-500" />
                    ) : (
                      <XIcon className="size-3.5 text-muted-foreground" />
                    )}
                    <span className={rule.passing ? "text-green-500" : "text-muted-foreground"}>
                      {rule.label}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="signup-confirm" className="text-xs text-foreground">
              Confirm Password
            </Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="signup-confirm"
                type={showConfirm ? "text" : "password"}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onBlur={() => setConfirmTouched(true)}
                placeholder="••••••••"
                aria-invalid={confirmMismatch}
                className={`h-12 rounded-xl pl-10 pr-10 dark:bg-card ${confirmMismatch ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              <button
                type="button"
                aria-label={showConfirm ? "Hide password" : "Show password"}
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none active:opacity-70"
              >
                {showConfirm ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            </div>
            {confirmMismatch && <p className="text-xs text-destructive">Passwords do not match.</p>}
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
          <span className="text-sm text-muted-foreground">Already have an account? </span>
          <Link
            href="/login"
            className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:underline"
          >
            Sign In
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
