import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LegalContent } from "@/components/shared/LegalContent";

const meta: Meta<typeof LegalContent> = {
  title: "Components/LegalContent",
  component: LegalContent,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LegalContent>;

export const Default: Story = {
  args: {
    title: "Sample Policy",
    lastUpdated: "August 10, 2026",
    children: (
      <>
        <p>This is an example section of body copy for a legal document.</p>
        <h2>A Subsection</h2>
        <p>Subsections use a slightly larger, bolder heading than the body text.</p>
        <ul>
          <li>List items are supported.</li>
          <li>They use a disc marker and consistent spacing.</li>
        </ul>
      </>
    ),
  },
};
