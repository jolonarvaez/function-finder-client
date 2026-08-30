"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  // `className` lets a wide page (e.g. the events grid) override the reading
  // width without changing it for every other page.
  return <div className={cn("mx-auto max-w-2xl px-4 py-6", className)}>{children}</div>;
}

type PageHeaderProps = Readonly<{
  title: string;
  icon?: React.ElementType;
  showBack?: boolean;
}>;

export function PageHeader({ title, icon: Icon, showBack = false }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-3 flex flex-col gap-4">
      {showBack && (
        <button
          className="w-fit flex items-center text-sm font-semibold"
          onClick={() => router.back()}
        >
          <ArrowLeft className="size-5 mr-1.5" />
          Back
        </button>
      )}
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-5 text-foreground" />}
        <h1 className="text-lg font-bold tracking-tight text-foreground">{title}</h1>
      </div>
    </div>
  );
}
