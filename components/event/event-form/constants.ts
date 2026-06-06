import { CalendarPlus2Icon, PencilLineIcon } from "lucide-react";
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
