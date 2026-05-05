"use client";

import React from "react";
import { ProfileView } from "@/components/profile/ProfileView";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function ProfilePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = React.use(params);
  return (
    <AuthGuard>
      <ProfileView userId={id} />
    </AuthGuard>
  );
}
