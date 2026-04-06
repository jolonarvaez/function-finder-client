import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Map, MapControls } from "@/components/ui/map";
import { UserLocationMarker } from "@/components/map/UserLocationMarker";
import { LocateOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Makati, Philippines
const CENTER: [number, number] = [121.0244, 14.5547];

function MapShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative h-full w-full">
      <Map className="h-full w-full" center={CENTER} zoom={15}>
        <MapControls position="bottom-right" showZoom />
        {children}
      </Map>
    </div>
  );
}

const meta: Meta = {
  title: "Map/UserLocationMarker",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div
        className="mx-auto w-full max-w-107.5 overflow-hidden bg-background"
        style={{ height: "600px" }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

export const Granted: Story = {
  name: "Granted — location visible",
  render: () => (
    <MapShell>
      <UserLocationMarker longitude={CENTER[0]} latitude={CENTER[1]} />
    </MapShell>
  ),
};

export const Denied: Story = {
  name: "Denied — permission refused",
  render: () => (
    <MapShell>
      {/* Banner shown when geolocation is denied */}
      <div
        role="status"
        aria-live="polite"
        className="absolute bottom-16 left-1/2 z-20 flex w-max -translate-x-1/2 items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg"
      >
        <LocateOff className="size-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-foreground">Location access denied.</p>
        <Button size="sm" onClick={() => {}}>
          Enable permissions
        </Button>
        <button
          type="button"
          aria-label="Dismiss"
          className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>
      </div>
    </MapShell>
  ),
};
