import { FaGoogle, FaApple, FaWaze } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MapLinksProps = Readonly<{
  /** Free-text address to search for. Renders nothing when empty. */
  address?: string | null;
  className?: string;
}>;

type MapLink = Readonly<{
  /** Visible button label */
  label: string;
  href: string;
  icon: React.ElementType;
}>;

/** Deep links that search Google Maps, Apple Maps and Waze for `address`. */
export function MapLinks({ address, className }: MapLinksProps) {
  const links = getMapLinks(address);
  if (links.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      {links.map(({ label, href, icon: Icon }) => (
        <Button key={label} asChild variant="outline" className="rounded-lg">
          <a href={href} target="_blank" rel="noopener noreferrer">
            <Icon className="size-3.5" aria-hidden="true" />
            {label}
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </Button>
      ))}
    </div>
  );
}

function getMapLinks(address?: string | null): MapLink[] {
  const trimmed = address?.trim();
  if (!trimmed) return [];
  const query = encodeURIComponent(trimmed);
  return [
    {
      label: "Google Maps",
      href: `https://www.google.com/maps/search/?api=1&query=${query}`,
      icon: FaGoogle,
    },
    {
      label: "Apple Maps",
      href: `https://maps.apple.com/?q=${query}`,
      icon: FaApple,
    },
    {
      label: "Waze",
      href: `https://waze.com/ul?q=${query}`,
      icon: FaWaze,
    },
  ];
}
