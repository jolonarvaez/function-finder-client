import { CalendarPlus2Icon, ClipboardCheckIcon, PencilLineIcon } from "lucide-react";
import { MAKATI_CENTER } from "@/lib/constants";
import type { EventFormMode } from "./types";

export type ModeConfig = {
  formId: string;
  headerTitle: string;
  headerIcon: typeof CalendarPlus2Icon;
  errorMessage: string;
  idleLabel: string;
  busyLabel: string;
};

export const MODE_CONFIG: Record<EventFormMode, ModeConfig> = {
  create: {
    formId: "create-event-form",
    headerTitle: "Create Event",
    headerIcon: CalendarPlus2Icon,
    errorMessage: "Failed to create event. Please try again.",
    idleLabel: "Create Event",
    busyLabel: "Creating...",
  },
  edit: {
    formId: "edit-event-form",
    headerTitle: "Edit Event",
    headerIcon: PencilLineIcon,
    errorMessage: "Failed to update event. Please try again.",
    idleLabel: "Save Changes",
    busyLabel: "Saving...",
  },
};

export const DEFAULT_COORDINATES = { lng: MAKATI_CENTER[0], lat: MAKATI_CENTER[1] };

/**
 * The create-only review step. Deliberately not keyed by mode: edit mode never
 * reaches it, and a mode-keyed record would force a meaningless `edit` entry.
 * MODE_CONFIG keeps its meaning as the *final commit* labels.
 */
export const REVIEW_STEP = {
  advanceLabel: "Review Event",
  headerTitle: "Review Event",
  headerIcon: ClipboardCheckIcon,
  stepLabel: "Review",
} as const;

/** Create flow: fill the form, then review it. Edit mode has no second step. */
export const CREATE_STEP_COUNT = 2;
// Not "Details" — that would stutter against the form's own DETAILS section
// header, which sits directly beneath the caption.
export const FORM_STEP_LABEL = "Event info";
