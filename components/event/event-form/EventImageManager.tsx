"use client";

import { useState } from "react";
import { ImageIcon, XIcon, StarIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  addEventImages,
  deleteEventImage,
  reorderEventImages,
  type ApiEvent,
} from "@/lib/services/events";
import { uploadEventImages } from "@/lib/services/storage";
import { MAX_EVENT_IMAGES, type EventImage } from "@/components/dj/dj-event.types";
import { reportError } from "./utils";

type Props = Readonly<{
  eventId: string;
  userId: string;
  images: EventImage[];
  onChange: (event: ApiEvent) => void;
}>;

export function EventImageManager({ eventId, userId, images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [busyImageId, setBusyImageId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const remaining = MAX_EVENT_IMAGES - images.length;
  const atCapacity = remaining <= 0;

  async function handleAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    if (files.length > remaining) {
      toast.error(`Maximum of ${MAX_EVENT_IMAGES} images per event.`);
      return;
    }

    setUploading(true);
    try {
      const urls = await uploadEventImages(files, userId);
      const updated = await addEventImages(eventId, urls);
      onChange(updated);
      toast.success(files.length > 1 ? "Images added." : "Image added.");
    } catch (err) {
      reportError(err, "Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove(imageId: string) {
    setBusyImageId(imageId);
    try {
      const updated = await deleteEventImage(eventId, imageId);
      onChange(updated);
    } catch (err) {
      reportError(err, "Failed to remove image.");
    } finally {
      setBusyImageId(null);
    }
  }

  async function handleDragReorder(from: number, to: number) {
    if (from === to) return;
    const nextOrder = images.map((img) => img.id);
    const [moved] = nextOrder.splice(from, 1);
    nextOrder.splice(to, 0, moved!);

    setReordering(true);
    try {
      const updated = await reorderEventImages(eventId, nextOrder);
      onChange(updated);
    } catch (err) {
      reportError(err, "Failed to reorder images.");
    } finally {
      setReordering(false);
    }
  }

  async function handleSetCover(imageId: string) {
    const index = images.findIndex((img) => img.id === imageId);
    if (index <= 0) return;
    const nextOrder = [imageId, ...images.filter((img) => img.id !== imageId).map((img) => img.id)];

    setReordering(true);
    setBusyImageId(imageId);
    try {
      const updated = await reorderEventImages(eventId, nextOrder);
      onChange(updated);
    } catch (err) {
      reportError(err, "Failed to reorder images.");
    } finally {
      setReordering(false);
      setBusyImageId(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {images.length} / {MAX_EVENT_IMAGES} · first image is the cover · drag to reorder
        </p>
        {uploading && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2Icon className="size-3 animate-spin" />
            Uploading…
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => {
          const isCover = index === 0;
          const isBusy = busyImageId === image.id;
          const busy = reordering || uploading;
          return (
            <div
              key={image.id}
              draggable={!busy}
              onDragStart={() => setDragSourceIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIndex(index);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragSourceIndex !== null && dragSourceIndex !== index) {
                  void handleDragReorder(dragSourceIndex, index);
                }
                setDragSourceIndex(null);
                setDragOverIndex(null);
              }}
              onDragEnd={() => {
                setDragSourceIndex(null);
                setDragOverIndex(null);
              }}
              className={cn(
                "relative h-36 w-36 shrink-0 overflow-hidden rounded-md border border-border bg-muted",
                !busy && "cursor-grab active:cursor-grabbing",
                isCover && "ring-2 ring-primary",
                dragOverIndex === index &&
                  dragSourceIndex !== index &&
                  "opacity-50 ring-2 ring-primary"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="h-full w-full object-cover" />

              {isCover ? (
                <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary-foreground">
                  <StarIcon className="size-2.5 fill-current" />
                  Cover
                </span>
              ) : (
                <button
                  type="button"
                  disabled={reordering || isBusy}
                  onClick={() => handleSetCover(image.id)}
                  className="absolute bottom-1 left-1 rounded-full bg-background/85 px-1.5 py-0.5 text-[9px] font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-background disabled:opacity-50"
                >
                  Cover
                </button>
              )}

              <button
                type="button"
                aria-label="Remove image"
                disabled={isBusy}
                onClick={() => handleRemove(image.id)}
                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-destructive disabled:opacity-50"
              >
                {isBusy ? (
                  <Loader2Icon className="size-3 animate-spin" />
                ) : (
                  <XIcon className="size-3" />
                )}
              </button>
              <span className="absolute bottom-1 right-1 rounded-full bg-background/85 px-1.5 py-0.5 text-[9px] font-medium tabular-nums text-foreground backdrop-blur-sm">
                {index + 1}
              </span>
            </div>
          );
        })}

        {!atCapacity && (
          <label
            className={cn(
              "relative flex h-36 w-36 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:bg-muted",
              uploading && "pointer-events-none opacity-60"
            )}
          >
            <ImageIcon className="size-5" />
            <span className="text-[10px] font-medium">Add</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              disabled={uploading}
              onChange={handleAdd}
            />
          </label>
        )}
      </div>
    </div>
  );
}
