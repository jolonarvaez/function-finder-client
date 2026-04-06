"use client";

export function PageContainer({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="mx-auto max-w-2xl px-4 py-6">{children}</div>;
}

type PageHeaderProps = Readonly<{
  title: string;
  icon?: React.ElementType;
}>;

export function PageHeader({ title, icon: Icon }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="size-5 text-foreground" />}
      <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
    </div>
  );
}
