import { create } from "zustand";
import type { OnboardingRole, Genre } from "@/lib/constants";

type Step = 1 | 2 | 3;

type OnboardingState = {
  step: Step;
  role: OnboardingRole | null;
  genres: Genre[];
  setStep: (step: Step) => void;
  setRole: (role: OnboardingRole) => void;
  setGenres: (genres: Genre[]) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  role: null,
  genres: [],
  setStep: (step) => set({ step }),
  setRole: (role) => set({ role }),
  setGenres: (genres) => set({ genres }),
  reset: () => set({ step: 1, role: null, genres: [] }),
}));
