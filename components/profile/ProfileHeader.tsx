"use client";

import { useState } from "react";
import { UserIcon, Link2Icon, CheckIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/services/users";
import { COUNTRY_ISO } from "@/lib/constants";
import ReactCountryFlag from "react-country-flag";
import { getInitials } from "./utils";
import { SocialLinks } from "./SocialLinks";

type ProfileHeaderProps = Readonly<{
  profile: UserProfile;
}>;

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const initials = getInitials(profile.display_name);
  const [copied, setCopied] = useState(false);

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            {profile.avatar_url && (
              <AvatarImage src={profile.avatar_url} alt={profile.display_name} />
            )}
            <AvatarFallback>{initials || <UserIcon className="size-5" />}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            {profile.display_name && (
              <p className="truncate text-base font-semibold text-foreground">
                {profile.display_name}
              </p>
            )}
            {profile.country && (
              <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                {COUNTRY_ISO[profile.country] && (
                  <ReactCountryFlag
                    countryCode={COUNTRY_ISO[profile.country]}
                    svg
                    style={{ width: "1.2em", height: "1.2em" }}
                  />
                )}
                {profile.country}
              </p>
            )}
          </div>
        </div>
        {profile.bio && <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>}
        <Button
          variant="outline"
          size="sm"
          aria-label="Copy profile link"
          onClick={handleCopyLink}
          className="w-fit gap-1.5 px-2"
        >
          {copied ? <CheckIcon className="size-4" /> : <Link2Icon className="size-4" />}
          {copied ? "Copied!" : "Copy Link to Profile"}
        </Button>
        {profile.socmed_links && <SocialLinks links={profile.socmed_links} />}
      </div>

      {profile.genre_tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {profile.genre_tags.map((genre) => (
            <Badge key={genre}>{genre}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
