import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function AppTopNav() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-3">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Logo size="sm" priority />
        <span className="text-md font-bold tracking-tight text-foreground">Function Finder</span>
      </div>

      <ThemeToggle />
    </header>
  );
}
