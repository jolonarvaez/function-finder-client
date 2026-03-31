import { create } from "zustand";
import type { Genre } from "@/lib/constants";

type MapFilterState = {
  selectedGenres: Genre[];
  query: string;
  setSelectedGenres: (genres: Genre[]) => void;
  setQuery: (query: string) => void;
  reset: () => void;
};

export const useMapFilterStore = create<MapFilterState>((set) => ({
  selectedGenres: [],
  query: "",
  setSelectedGenres: (genres) => set({ selectedGenres: genres }),
  setQuery: (query) => set({ query }),
  reset: () => set({ selectedGenres: [], query: "" }),
}));
