import { create } from "zustand";
import type { Genre, VenueFilter } from "@/lib/constants";

type MapFilterState = {
  selectedGenres: Genre[];
  query: string;
  activeFilter: VenueFilter;
  selectedDate: Date | undefined;
  setSelectedGenres: (genres: Genre[]) => void;
  setQuery: (query: string) => void;
  setActiveFilter: (filter: VenueFilter) => void;
  setSelectedDate: (date: Date | undefined) => void;
  reset: () => void;
};

export const useMapFilterStore = create<MapFilterState>((set) => ({
  selectedGenres: [],
  query: "",
  activeFilter: "live-now",
  selectedDate: undefined,
  setSelectedGenres: (genres) => set({ selectedGenres: genres }),
  setQuery: (query) => set({ query }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  reset: () => set({ selectedGenres: [], query: "", activeFilter: "live-now", selectedDate: undefined }),
}));
