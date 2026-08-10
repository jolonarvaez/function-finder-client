"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", icon: SunIcon, label: "Light" },
  { value: "system", icon: MonitorIcon, label: "System" },
  { value: "dark", icon: MoonIcon, label: "Dark" },
] as const;

export type ThemeToggleProps = Readonly<{
  className?: string;
}>;

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <div className={cn("flex items-center gap-1 rounded-lg border border-border p-1", className)}>
      {THEMES.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={label}
          className={cn(
            "flex size-7 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            mounted && theme === value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  );
}
