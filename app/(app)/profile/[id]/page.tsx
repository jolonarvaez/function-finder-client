"use client";

import React from "react";
import { PublicProfileView } from "@/components/profile/PublicProfileView";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function PublicProfilePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = React.use(params);
  return (
    <AuthGuard>
      <PublicProfileView userId={id} />
    </AuthGuard>
  );
}
