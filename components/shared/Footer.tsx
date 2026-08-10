import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { cn } from "@/lib/utils";

export type FooterProps = Readonly<{
  className?: string;
}>;

export function Footer({ className }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t border-border bg-card", className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-row items-center justify-between gap-2 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Logo size="sm" className="hidden sm:block" />
          <span className="whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
            &copy; {year} <span>Function Finder</span>
          </span>
        </div>

        <nav aria-label="Legal" className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/privacy"
            className="rounded-sm whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
          >
            <span className="sm:hidden">Privacy</span>
            <span className="hidden sm:inline">Privacy Policy</span>
          </Link>
          <Link
            href="/terms"
            className="rounded-sm whitespace-nowrap text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
          >
            <span className="sm:hidden">Terms</span>
            <span className="hidden sm:inline">Terms and Conditions</span>
          </Link>
        </nav>
      </div>
    </footer>
  );
}
