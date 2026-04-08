import { create } from "zustand";
import type { Genre, VenueFilter } from "@/lib/constants";

export type DateRangeType = "day" | "week" | "month";

export function computeDateRange(
  type: DateRangeType,
  ref: Date
): { startDate: Date; endDate: Date } {
  if (type === "day") {
    return { startDate: ref, endDate: ref };
  }

  if (type === "week") {
    const day = ref.getDay(); // 0 = Sunday
    const sunday = new Date(ref);
    sunday.setDate(ref.getDate() - day);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    return { startDate: sunday, endDate: saturday };
  }

  // month
  const firstDay = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const lastDay = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
  return { startDate: firstDay, endDate: lastDay };
}

type MapFilterState = {
  selectedGenres: Genre[];
  query: string;
  activeFilter: VenueFilter;
  dateRangeType: DateRangeType;
  referenceDate: Date | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  setSelectedGenres: (genres: Genre[]) => void;
  setQuery: (query: string) => void;
  setActiveFilter: (filter: VenueFilter) => void;
  setDateRange: (type: DateRangeType, ref: Date | undefined) => void;
  reset: () => void;
};

export const useMapFilterStore = create<MapFilterState>((set) => ({
  selectedGenres: [],
  query: "",
  activeFilter: "live-now",
  dateRangeType: "week",
  referenceDate: undefined,
  startDate: undefined,
  endDate: undefined,
  setSelectedGenres: (genres) => set({ selectedGenres: genres }),
  setQuery: (query) => set({ query }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setDateRange: (type, ref) => {
    if (!ref) {
      set({
        dateRangeType: type,
        referenceDate: undefined,
        startDate: undefined,
        endDate: undefined,
      });
      return;
    }
    const { startDate, endDate } = computeDateRange(type, ref);
    set({ dateRangeType: type, referenceDate: ref, startDate, endDate });
  },
  reset: () =>
    set({
      selectedGenres: [],
      query: "",
      activeFilter: "live-now",
      dateRangeType: "week",
      referenceDate: undefined,
      startDate: undefined,
      endDate: undefined,
    }),
}));
