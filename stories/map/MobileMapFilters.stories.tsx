import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MobileMapFilters } from "@/components/map/MobileMapFilters";
import { useMapFilterStore } from "@/components/map/use-map-filter-store";
import { useEffect } from "react";

const meta: Meta<typeof MobileMapFilters> = {
  title: "Components/MobileMapFilters",
  component: MobileMapFilters,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-107.5 overflow-hidden bg-background p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MobileMapFilters>;

export const Default: Story = {
  render: () => <MobileMapFilters />,
};

function WithActiveFiltersDemo() {
  const { setSelectedGenres, setEventStatus } = useMapFilterStore();

  useEffect(() => {
    setSelectedGenres(["House", "Techno", "Disco"]);
    setEventStatus("upcoming");
  }, [setSelectedGenres, setEventStatus]);

  return <MobileMapFilters />;
}

export const WithActiveFilters: Story = {
  render: () => <WithActiveFiltersDemo />,
};
