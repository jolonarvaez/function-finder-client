import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddressAutocomplete } from "@/components/event/event-form/AddressAutocomplete";

const noop = () => {};

const meta: Meta<typeof AddressAutocomplete> = {
  title: "Components/Event/EventForm/AddressAutocomplete",
  component: AddressAutocomplete,
  tags: ["autodocs"],
  args: {
    onChange: noop,
    onSelect: noop,
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AddressAutocomplete>;

export const Empty: Story = {
  args: {
    value: "",
  },
};

export const WithValue: Story = {
  name: "With prefilled address",
  args: {
    value: "123 Ayala Ave, Makati City",
  },
};

export const Interactive: Story = {
  name: "Interactive (live search)",
  render: () => {
    const [value, setValue] = React.useState("");
    return (
      <AddressAutocomplete
        value={value}
        onChange={setValue}
        onSelect={(s) => setValue(s.display_name)}
      />
    );
  },
};
