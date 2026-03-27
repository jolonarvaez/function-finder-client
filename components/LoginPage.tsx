"use client";

import * as React from "react";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-14">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome Back
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to continue your nightlife journey
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-xs text-foreground">
            Email Address
          </Label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="login-email"
              type="email"
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
              placeholder="••••••••"
              className="h-12 rounded-xl pl-10 pr-10 dark:bg-card"
            />
            <button
              type="button"
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

        <div className="flex justify-end">
          <button className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:underline">
            Forgot password?
          </button>
        </div>

        <Button
          variant="outline"
          className="h-12 w-full rounded-xl text-sm font-medium dark:bg-card"
        >
          Sign In
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="mb-8 flex justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          disabled
          title="Sign in with Google"
          className="size-12 rounded-xl text-sm font-bold"
        >
          G
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled
          title="Sign in with Facebook"
          className="size-12 rounded-xl text-base font-bold"
        >
          f
        </Button>
      </div>

      <div className="mb-6 text-center">
        <span className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
        </span>
        <button className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:underline">
          Sign Up
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to Nyte&apos;s{" "}
        <a
          href="#"
          className="text-primary hover:underline focus-visible:outline-none"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-primary hover:underline focus-visible:outline-none"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
