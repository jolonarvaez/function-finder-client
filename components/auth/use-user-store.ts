import { create } from "zustand";
import type { UserProfile } from "@/lib/services/users";

type UserStoreState = {
  profile: UserProfile | null;
  loading: boolean;
  setProfile: (profile: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
};

export const useUserStore = create<UserStoreState>((set) => ({
  profile: null,
  loading: false,
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  clear: () => set({ profile: null, loading: false }),
}));
