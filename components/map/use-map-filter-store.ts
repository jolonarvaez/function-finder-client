import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { EventStatus, Genre, VenueFilter } from "@/lib/constants";

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
  eventStatus: EventStatus;
  dateRangeType: DateRangeType;
  referenceDate: Date | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  setSelectedGenres: (genres: Genre[]) => void;
  setQuery: (query: string) => void;
  setActiveFilter: (filter: VenueFilter) => void;
  setEventStatus: (status: EventStatus) => void;
  setDateRange: (type: DateRangeType, ref: Date | undefined) => void;
  reset: () => void;
};

export const useMapFilterStore = create<MapFilterState>()(
  persist(
    (set) => ({
      selectedGenres: [],
      query: "",
      activeFilter: "live-now",
      eventStatus: "all",
      dateRangeType: "week",
      referenceDate: undefined,
      startDate: undefined,
      endDate: undefined,
      setSelectedGenres: (genres) => set({ selectedGenres: genres }),
      setQuery: (query) => set({ query }),
      setActiveFilter: (filter) => set({ activeFilter: filter }),
      setEventStatus: (status) => set({ eventStatus: status }),
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
          eventStatus: "all",
          dateRangeType: "week",
          referenceDate: undefined,
          startDate: undefined,
          endDate: undefined,
        }),
    }),
    {
      name: "map-filters",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) =>
        ({
          selectedGenres: state.selectedGenres,
          query: state.query,
          activeFilter: state.activeFilter,
          eventStatus: state.eventStatus,
          dateRangeType: state.dateRangeType,
          referenceDate: state.referenceDate?.toISOString() ?? null,
          startDate: state.startDate?.toISOString() ?? null,
          endDate: state.endDate?.toISOString() ?? null,
        }) as unknown as MapFilterState,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const s = state as unknown as Record<string, unknown>;
        state.referenceDate = s.referenceDate
          ? new Date(s.referenceDate as string)
          : undefined;
        state.startDate = s.startDate
          ? new Date(s.startDate as string)
          : undefined;
        state.endDate = s.endDate
          ? new Date(s.endDate as string)
          : undefined;
      },
    }
  )
);
