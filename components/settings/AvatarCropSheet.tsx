"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

// ── Canvas helper ─────────────────────────────────────────────

async function cropImageToBlob(imageSrc: string, pixelCrop: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/jpeg",
      0.92
    );
  });
}

// ── Types ─────────────────────────────────────────────────────

export type AvatarCropSheetProps = Readonly<{
  imageSrc: string | null;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}>;

// ── Component ─────────────────────────────────────────────────

export function AvatarCropSheet({ imageSrc, onConfirm, onCancel }: AvatarCropSheetProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleConfirm() {
    if (!imageSrc || !croppedAreaPixels) return;
    const blob = await cropImageToBlob(imageSrc, croppedAreaPixels);
    onConfirm(blob);
  }

  return (
    <Sheet
      open={!!imageSrc}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <SheetContent side="bottom" className="mx-auto max-w-xl rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Adjust Photo</SheetTitle>
        </SheetHeader>

        {/* Crop area */}
        <div className="relative h-72 w-full overflow-hidden rounded-xl bg-black">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 px-1 pt-2">
          <span className="text-xs text-muted-foreground">−</span>
          <Slider
            min={1}
            max={3}
            step={0.01}
            value={[zoom]}
            onValueChange={([v]) => setZoom(v)}
            aria-label="Zoom"
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground">+</span>
        </div>

        <SheetFooter className="flex-row gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirm}>
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
