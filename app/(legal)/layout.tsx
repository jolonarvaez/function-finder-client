import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { Footer } from "@/components/shared/Footer";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function LegalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-md font-semibold tracking-tight text-foreground">
              Function Finder
            </span>
          </Link>
          <div className="flex items-center gap-4">
         
            <Link
              href="/"
              className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Back
            </Link>
               <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
