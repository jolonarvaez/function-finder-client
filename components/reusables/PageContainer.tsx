"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function PageContainer({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="mx-auto max-w-2xl px-4 py-6">{children}</div>;
}

type PageHeaderProps = Readonly<{
  title: string;
  icon?: React.ElementType;
  showBack?: boolean;
}>;

export function PageHeader({ title, icon: Icon, showBack = false }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-3 flex items-center gap-2">
      {showBack && (
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="-ml-1 flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 active:bg-muted/80"
        >
          <ArrowLeft className="size-5" />
        </button>
      )}
      {Icon && <Icon className="size-5 text-foreground" />}
      <h1 className="text-lg font-bold tracking-tight text-foreground">{title}</h1>
    </div>
  );
}
