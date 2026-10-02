"use client";

import { useRef, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { extractEventFromPoster } from "@/lib/services/events";
import { getPlaceDetails, searchAddress } from "@/lib/services/geocode/geocode";
import { MAX_EVENT_IMAGES } from "@/components/dj/dj-event.types";
import {
  POSTER_MAX_BYTES,
  POSTER_MIME_TYPES,
  type PosterAutofillProps,
  type PosterAutofillStatus,
} from "./PosterAutofill";
import { mapExtractedEvent, type AutofillValues } from "./utils";
import type { StagedImage } from "./types";

type AutofillState = {
  status: PosterAutofillStatus;
  preview?: string;
  error?: string;
  notice?: string;
};

type UsePosterAutofillOptions = {
  staged: StagedImage[];
  setStaged: (next: StagedImage[]) => void;
  /** Receives only the fields the poster provided; overwrite the form with them. */
  onExtracted: (values: AutofillValues) => void;
  /** Called later, if the extracted address geocodes, to move the map pin. */
  onLocated: (coords: { lat: number; lng: number }) => void;
};

function toExtractErrorMessage(err: unknown): string {
  if (err instanceof AxiosError && err.response?.status === 400) {
    return (
      (err.response.data as { message?: string } | undefined)?.message ??
      "That image can't be read. Use a PNG, JPEG, WebP or HEIC up to 10MB."
    );
  }
  return "We couldn't read that poster. Try again, or fill in the form manually.";
}

/** Best-effort: resolves an extracted address to coordinates, or null. */
async function locateAddress(query: string): Promise<{ lat: number; lng: number } | null> {
  const [top] = await searchAddress(query);
  if (!top) return null;
  const place = await getPlaceDetails(top.place_id);
  if (!place) return null;
  return { lat: Number.parseFloat(place.lat), lng: Number.parseFloat(place.lon) };
}

/**
 * Create-mode "autofill from poster": validates the flyer, stages it as the
 * cover image, sends it for extraction, and hands the result back to the form.
 */
export function usePosterAutofill({
  staged,
  setStaged,
  onExtracted,
  onLocated,
}: UsePosterAutofillOptions) {
  const [state, setState] = useState<AutofillState>({ status: "idle" });
  // Which staged entry is the poster, so a re-upload replaces it instead of duplicating.
  const posterPreviewRef = useRef<string | null>(null);
  const extracting = state.status === "extracting";

  function stagePoster(file: File) {
    const rest = staged.filter((s) => s.preview !== posterPreviewRef.current);
    if (rest.length >= MAX_EVENT_IMAGES) {
      toast.error(`Maximum of ${MAX_EVENT_IMAGES} images per event — poster wasn't added.`);
      return;
    }
    if (posterPreviewRef.current) URL.revokeObjectURL(posterPreviewRef.current);
    const entry = { file, preview: URL.createObjectURL(file) };
    posterPreviewRef.current = entry.preview;
    setStaged([entry, ...rest]);
  }

  async function handleSelect(file: File) {
    if (extracting) return;
    if (!(POSTER_MIME_TYPES as readonly string[]).includes(file.type)) {
      setState({ status: "error", error: "Use a PNG, JPEG, WebP or HEIC image." });
      return;
    }
    if (file.size > POSTER_MAX_BYTES) {
      setState({ status: "error", error: "Poster must be 10MB or smaller." });
      return;
    }

    // The card keeps its own preview URL so removing the poster from Images
    // doesn't break the thumbnail here.
    if (state.preview) URL.revokeObjectURL(state.preview);
    const preview = URL.createObjectURL(file);
    stagePoster(file);
    setState({ status: "extracting", preview });

    try {
      const { values, datePassed } = mapExtractedEvent(
        await extractEventFromPoster(file),
        new Date()
      );
      const notice = datePassed ? "The date on this poster has passed. Pick a new one." : undefined;
      if (Object.keys(values).length === 0) {
        setState({
          status: "error",
          preview,
          error: notice ?? "We couldn't find any event details on this poster.",
        });
        return;
      }
      onExtracted(values);
      setState({ status: "done", preview, notice });
      if (values.address) {
        void locateAddress(values.address).then((coords) => coords && onLocated(coords));
      }
    } catch (err) {
      setState({ status: "error", preview, error: toExtractErrorMessage(err) });
    }
  }

  const cardProps: PosterAutofillProps = {
    status: state.status,
    preview: state.preview,
    error: state.error,
    notice: state.notice,
    onSelect: (file) => void handleSelect(file),
  };

  return { cardProps, extracting };
}
