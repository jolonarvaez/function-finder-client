"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon, MonitorIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", icon: SunIcon, label: "Light" },
  { value: "system", icon: MonitorIcon, label: "System" },
  { value: "dark", icon: MoonIcon, label: "Dark" },
] as const;

export function AppTopNav() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="text-xl font-bold tracking-tight text-foreground">Function Finder</span>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-border p-1">
        {THEMES.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-label={label}
            className={cn(
              "flex size-7 items-center justify-center rounded-md transition-colors",
              mounted && theme === value
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="size-3.5" />
          </button>
        ))}
      </div>
    </header>
  );
}
