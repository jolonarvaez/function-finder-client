"use client";

import { useState } from "react";
import { ImageIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_EVENT_IMAGES } from "@/components/dj/dj-event.types";

export type StagedImagePickerProps = Readonly<{
  previews: string[];
  onAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
  onSetCover: (index: number) => void;
  onReorder: (from: number, to: number) => void;
}>;

export function StagedImagePicker({
  previews,
  onAdd,
  onRemove,
  onSetCover,
  onReorder,
}: StagedImagePickerProps) {
  const atCapacity = previews.length >= MAX_EVENT_IMAGES;
  const [dragSourceIndex, setDragSourceIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        {previews.length} / {MAX_EVENT_IMAGES} · first image is the cover · drag to reorder
      </p>
      <div className="flex flex-wrap gap-2">
        {previews.map((preview, index) => {
          const isCover = index === 0;
          return (
            <div
              key={preview}
              draggable
              onDragStart={() => setDragSourceIndex(index)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverIndex(index);
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (dragSourceIndex !== null && dragSourceIndex !== index) {
                  onReorder(dragSourceIndex, index);
                }
                setDragSourceIndex(null);
                setDragOverIndex(null);
              }}
              onDragEnd={() => {
                setDragSourceIndex(null);
                setDragOverIndex(null);
              }}
              className={cn(
                "relative h-36 w-36 shrink-0 cursor-grab overflow-hidden rounded-md border border-border bg-muted active:cursor-grabbing",
                isCover && "ring-2 ring-primary",
                dragOverIndex === index &&
                  dragSourceIndex !== index &&
                  "opacity-50 ring-2 ring-primary"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="h-full w-full object-cover" />
              {isCover ? (
                <span className="absolute left-1 top-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-primary-foreground">
                  Cover
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onSetCover(index)}
                  className="absolute bottom-1 left-1 rounded-full bg-background/85 px-1.5 py-0.5 text-[9px] font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-background"
                >
                  Cover
                </button>
              )}
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => onRemove(index)}
                className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-background/85 text-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-destructive"
              >
                <XIcon className="size-3" />
              </button>
              <span className="absolute bottom-1 right-1 rounded-full bg-background/85 px-1.5 py-0.5 text-[9px] font-medium tabular-nums text-foreground backdrop-blur-sm">
                {index + 1}
              </span>
            </div>
          );
        })}

        {!atCapacity && (
          <label className="relative flex h-36 w-36 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border text-muted-foreground transition-colors hover:bg-muted">
            <ImageIcon className="size-5" />
            <span className="text-[10px] font-medium">Add</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={onAdd}
            />
          </label>
        )}
      </div>
    </div>
  );
}
