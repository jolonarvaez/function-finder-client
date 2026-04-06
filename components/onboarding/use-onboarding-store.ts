import { create } from "zustand";
import type { OnboardingRole, Genre } from "@/lib/constants";

type Step = 1 | 2 | 3 | 4;

type OnboardingState = {
  step: Step;
  role: OnboardingRole | null;
  displayName: string;
  bio: string;
  country: string;
  genres: Genre[];
  setStep: (step: Step) => void;
  setRole: (role: OnboardingRole) => void;
  setProfile: (displayName: string, bio: string, country: string) => void;
  setGenres: (genres: Genre[]) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  role: null,
  displayName: "",
  bio: "",
  country: "",
  genres: [],
  setStep: (step) => set({ step }),
  setRole: (role) => set({ role }),
  setProfile: (displayName, bio, country) => set({ displayName, bio, country }),
  setGenres: (genres) => set({ genres }),
  reset: () => set({ step: 1, role: null, displayName: "", bio: "", country: "", genres: [] }),
}));
