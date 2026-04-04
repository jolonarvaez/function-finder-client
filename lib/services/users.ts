import api from "@/lib/axios";
import type { OnboardingRole, Genre } from "@/lib/constants";

// ── Types ─────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  bio: string | null;
  genre_tags: Genre[];
  country: string | null;
  socmed_links: Record<string, string> | null;
  profile_type: OnboardingRole | null;
};

type ApiUserResponse = {
  status: number;
  message: string;
  data: UserProfile;
};

type UpdateUserBody = {
  profile_type: OnboardingRole;
  genre_tags: Genre[];
};

// ── Service functions ─────────────────────────────────────────

async function getUser(id: string): Promise<UserProfile> {
  const { data } = await api.get<ApiUserResponse>(`/users/${id}`);
  return data.data;
}

async function updateUser(id: string, body: UpdateUserBody): Promise<void> {
  await api.patch(`/users/${id}`, body);
}

export { getUser, updateUser };
