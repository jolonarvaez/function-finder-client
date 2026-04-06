"use client";

import { useRouter } from "next/navigation";
import { UserIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserStore } from "@/components/auth/use-user-store";
import { PageContainer } from "../reusables/PageContainer";
import { getInitials } from "./utils";
import { SocialLinks } from "./SocialLinks";
import { COUNTRY_ISO } from "@/lib/constants";
import ReactCountryFlag from "react-country-flag";

export function ProfileView() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile } = useUserStore();

  const name = profile?.display_name ?? (user?.user_metadata?.full_name as string | undefined);
  const email = user?.email;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  const genres = profile?.genre_tags ?? [];
  const bio = profile?.bio;
  const country = profile?.country;

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Avatar + identity */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name ?? "Avatar"} />}
              <AvatarFallback>
                {getInitials(name) || <UserIcon className="size-5" />}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              {name && <p className="truncate text-base font-semibold text-foreground">{name}</p>}
              {email && <p className="truncate text-sm text-muted-foreground">{email}</p>}
              {country && (
                <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                  {COUNTRY_ISO[country] && (
                    <ReactCountryFlag
                      countryCode={COUNTRY_ISO[country]}
                      svg
                      style={{ width: "1.2em", height: "1.2em" }}
                    />
                  )}
                  {country}
                </p>
              )}
            </div>
          </div>
          {bio && <p className="text-sm text-foreground leading-relaxed">{bio}</p>}
          {profile?.socmed_links && <SocialLinks links={profile.socmed_links} />}
        </div>

        <div className="h-px bg-border" />

        {/* Genre preferences */}
        <section aria-labelledby="genres-heading" className="space-y-3">
          <div className="space-y-0.5">
            <h2 id="genres-heading" className="text-base font-semibold text-foreground">
              Preferred Genres
            </h2>
            <p className="text-sm text-muted-foreground">Used to personalise your map feed.</p>
          </div>
          {genres.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge key={genre}>{genre}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No genres selected.</p>
          )}
          <p className="text-xs text-muted-foreground">To change your genres, go to Settings.</p>
        </section>

        <div className="h-px bg-border" />

        <Button
          variant="outline"
          onClick={() => router.push("/settings")}
          className="h-11 w-full rounded-lg text-sm"
        >
          Go to Settings
        </Button>
      </div>
    </PageContainer>
  );
}
