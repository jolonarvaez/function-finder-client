"use client";

import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/lib/services/users";
import { COUNTRY_ISO } from "@/lib/constants";
import ReactCountryFlag from "react-country-flag";
import { getInitials } from "./utils";
import { SocialLinks } from "./SocialLinks";

type PublicProfileHeaderProps = Readonly<{
  profile: UserProfile;
}>;

export function PublicProfileHeader({ profile }: PublicProfileHeaderProps) {
  const initials = getInitials(profile.display_name);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <Avatar className="size-14">
            <AvatarFallback>{initials || <UserIcon className="size-5" />}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
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
