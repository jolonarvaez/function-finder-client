"use client";

import React from "react";
import { ProfileView } from "@/components/profile/ProfileView";

export default function ProfilePage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = React.use(params);
  return <ProfileView userId={id} />;
}
