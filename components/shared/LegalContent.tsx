import { cn } from "@/lib/utils";

export type LegalContentProps = Readonly<{
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
  className?: string;
}>;

export function LegalContent({ title, lastUpdated, children, className }: LegalContentProps) {
  return (
    <article className={cn("mx-auto w-full max-w-3xl px-6 py-10", className)}>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

      <div
        className={cn(
          "mt-8 space-y-4 text-sm leading-7 text-foreground",
          "[&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground",
          "[&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
          "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"
        )}
      >
        {children}
      </div>
    </article>
  );
}
