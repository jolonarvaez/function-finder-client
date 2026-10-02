"use client";

import { useRef } from "react";
import { ImageIcon, ImageUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/** Mirrors the API's allowlist for `POST /events/extract`. */
export const POSTER_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export const POSTER_MAX_BYTES = 10 * 1024 * 1024;

export type PosterAutofillStatus = "idle" | "extracting" | "done" | "error";

export type PosterAutofillProps = Readonly<{
  status: PosterAutofillStatus;
  /** Preview of the uploaded poster. Must already be sanitized by the caller. */
  preview?: string;
  error?: string;
  /** Extra guidance shown with the done state, e.g. a skipped past date. */
  notice?: string;
  onSelect: (file: File) => void;
}>;

const STATUS_MESSAGES: Record<Exclude<PosterAutofillStatus, "error">, string> = {
  idle: "Upload a flyer and we'll fill in what we can.",
  extracting: "Reading your poster…",
  done: "Details added from your poster. Review them below.",
};

export function PosterAutofill({ status, preview, error, notice, onSelect }: PosterAutofillProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const extracting = status === "extracting";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Reset so picking the same file again still fires a change.
    e.target.value = "";
    if (file) onSelect(file);
  }

  return (
    <section
      aria-labelledby="poster-autofill-title"
      aria-busy={extracting}
      className={cn(
        "rounded-xl border border-dashed bg-card p-4",
        status === "error" ? "border-destructive/50" : "border-primary/40"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Uploaded poster" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="size-6 text-muted-foreground" aria-hidden />
          )}
          {extracting && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <Spinner aria-hidden className="size-5 text-primary" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 id="poster-autofill-title" className="text-sm font-bold text-foreground">
            Autofill from poster
          </h2>
          <p
            aria-live="polite"
            className={cn(
              "mt-0.5 text-xs leading-relaxed",
              status === "error" ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {status === "error"
              ? (error ?? "Something went wrong reading your poster.")
              : STATUS_MESSAGES[status]}
            {status === "done" && notice && (
              <span className="mt-0.5 block font-medium text-foreground">{notice}</span>
            )}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={POSTER_MIME_TYPES.join(",")}
        onChange={handleChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
      />

      {/* Kept mounted (just disabled) while extracting so keyboard focus isn't dropped. */}
      <Button
        type="button"
        variant={status === "idle" ? "default" : "outline"}
        onClick={() => inputRef.current?.click()}
        disabled={extracting}
        className="mt-3 h-11 w-full rounded-lg"
      >
        <ImageUpIcon className="size-4" aria-hidden />
        {extracting ? "Extracting…" : status === "idle" ? "Upload poster" : "Try another poster"}
      </Button>
    </section>
  );
}
