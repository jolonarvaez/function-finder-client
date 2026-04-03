import { TopNav } from "@/components/sidebar/TopNav";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <TopNav>{children}</TopNav>;
}
