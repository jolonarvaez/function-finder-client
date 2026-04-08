"use client";

import { SocialPlatform } from "@/lib/constants";
import {
  FaFacebook,
  FaSoundcloud,
  FaInstagram,
  FaSpotify,
  FaYoutube,
  FaTiktok,
  FaGlobe,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const PLATFORM_META: Record<SocialPlatform, { label: string; icon: React.ReactNode }> = {
  twitter: {
    label: "X (Twitter)",
    icon: <FaXTwitter className="size-4.5 shrink-0 fill-foreground" aria-hidden="true" />,
  },
  instagram: {
    label: "Instagram",
    icon: <FaInstagram className="size-4.5 shrink-0 fill-foreground" aria-hidden="true" />,
  },
  facebook: {
    label: "Facebook",
    icon: <FaFacebook className="size-4.5 shrink-0 fill-foreground" aria-hidden="true" />,
  },
  soundcloud: {
    label: "SoundCloud",
    icon: <FaSoundcloud className="size-4.5 shrink-0 fill-foreground" aria-hidden="true" />,
  },
  spotify: {
    label: "Spotify",
    icon: <FaSpotify className="size-4.5 shrink-0 fill-foreground" aria-hidden="true" />,
  },
  youtube: {
    label: "YouTube",
    icon: <FaYoutube className="size-4.5 shrink-0 fill-foreground" aria-hidden="true" />,
  },
  tiktok: {
    label: "TikTok",
    icon: <FaTiktok className="size-4.5 shrink-0 fill-foreground" aria-hidden="true" />,
  },
  website: {
    label: "Website",
    icon: <FaGlobe className="size-4.5 shrink-0 fill-foreground" aria-hidden="true" />,
  },
};

type SocialLinksProps = Readonly<{
  links: Record<SocialPlatform, string>;
}>;

export function SocialLinks({ links }: SocialLinksProps) {
  const entries = (Object.entries(links) as [SocialPlatform, string][])
    .filter(([platform, value]) => value.trim() !== "" && platform in PLATFORM_META)
    .sort(([a], [b]) => a.localeCompare(b));

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {entries.map(([platform, value]) => {
        const meta = PLATFORM_META[platform];
        const href = value.startsWith("http") ? value : `https://${value}`;
        return (
          <a
            key={platform}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${meta.label}: ${value}`}
            className="flex items-center gap-2 text-sm text-foreground hover:underline w-fit"
          >
            {meta.icon}
            <span className="truncate">{value}</span>
          </a>
        );
      })}
    </div>
  );
}
