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
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 py-5 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="text-sm text-muted-foreground">&copy; {year} Function Finder</span>
        </div>

        <nav aria-label="Legal" className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Terms and Conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}
