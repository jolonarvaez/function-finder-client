import { create } from "zustand";
import type { Genre, VenueFilter } from "@/lib/constants";

type MapFilterState = {
  selectedGenres: Genre[];
  query: string;
  activeFilter: VenueFilter;
  setSelectedGenres: (genres: Genre[]) => void;
  setQuery: (query: string) => void;
  setActiveFilter: (filter: VenueFilter) => void;
  reset: () => void;
};

export const useMapFilterStore = create<MapFilterState>((set) => ({
  selectedGenres: [],
  query: "",
  activeFilter: "live-now",
  setSelectedGenres: (genres) => set({ selectedGenres: genres }),
  setQuery: (query) => set({ query }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  reset: () => set({ selectedGenres: [], query: "", activeFilter: "live-now" }),
}));
