"use client";

import React from "react";
import { PublicProfileView } from "@/components/profile/PublicProfileView";

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  return <PublicProfileView userId={id} />;
}
