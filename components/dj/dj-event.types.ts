import { parseISO } from "date-fns";
import { MAKATI_CENTER } from "@/lib/constants";
import type { Genre } from "@/lib/constants";

// ── Core type ────────────────────────────────────────────────

export type DJEvent = {
  id: string;
  name: string;
  venue: string;
  address: string;
  category: string;
  /** ISO date string "YYYY-MM-DD" */
  date: string;
  startTime: string;
  endTime: string;
  entryPrice?: number;
  genres: Genre[];
  coordinates?: { lng: number; lat: number };
};

export type EventStatus = "live" | "upcoming" | "past";

// ── Edit draft ───────────────────────────────────────────────

export type EditDraft = {
  name: string;
  date: Date;
  dateOpen: boolean;
  startTime: string;
  endTime: string;
  entryPrice: string;
  genres: Genre[];
  locationMode: "map" | "venue";
  coordinates: { lng: number; lat: number };
  address: string;
  selectedVenueId: string;
};

// ── Helpers ──────────────────────────────────────────────────

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getStatus(event: DJEvent): EventStatus {
  const today = todayISO();
  if (event.date < today) return "past";
  if (event.date > today) return "upcoming";
  const now = new Date();
  const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  if (nowTime < event.startTime) return "upcoming";
  if (nowTime > event.endTime) return "past";
  return "live";
}

export function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "AM" : "PM";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

export function draftFromEvent(e: DJEvent): EditDraft {
  return {
    name: e.name,
    date: parseISO(e.date),
    dateOpen: false,
    startTime: e.startTime,
    endTime: e.endTime,
    entryPrice: e.entryPrice != null ? String(e.entryPrice) : "",
    genres: [...e.genres],
    locationMode: "map",
    coordinates: e.coordinates ?? { lng: MAKATI_CENTER[0], lat: MAKATI_CENTER[1] },
    address: e.address,
    selectedVenueId: "",
  };
}

export function draftToPartial(draft: EditDraft, original: DJEvent): Partial<DJEvent> {
  return {
    name: draft.name.trim() || original.name,
    date: `${draft.date.getFullYear()}-${String(draft.date.getMonth() + 1).padStart(2, "0")}-${String(draft.date.getDate()).padStart(2, "0")}`,
    startTime: draft.startTime,
    endTime: draft.endTime,
    entryPrice: draft.entryPrice ? Number(draft.entryPrice) : undefined,
    genres: draft.genres,
    coordinates: draft.coordinates,
    address: draft.address,
  };
}
