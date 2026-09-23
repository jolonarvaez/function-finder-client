import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StepIndicator } from "@/components/reusables/StepIndicator";
import { ONBOARDING_STEP_COUNT } from "@/lib/constants";
import { CREATE_STEP_COUNT } from "@/components/event/event-form/constants";

const meta: Meta<typeof StepIndicator> = {
  title: "Reusables/StepIndicator",
  component: StepIndicator,
  tags: ["autodocs"],
  argTypes: {
    currentStep: { control: { type: "number", min: 0, step: 1 } },
    totalSteps: { control: { type: "number", min: 1, step: 1 } },
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
type Story = StoryObj<typeof StepIndicator>;

/** The event create flow: fill the form, then review it. */
export const CreateEventFlow: Story = {
  args: { currentStep: 1, totalSteps: CREATE_STEP_COUNT },
};

export const CreateEventFlowReview: Story = {
  name: "Create event flow — review step",
  args: { currentStep: 2, totalSteps: CREATE_STEP_COUNT },
};

/** The four-step onboarding flow, its original caller. */
export const Onboarding: Story = {
  args: { currentStep: 2, totalSteps: ONBOARDING_STEP_COUNT },
};

/** Every position at both lengths, for comparing fill and spacing. */
export const AllPositions: Story = {
  render: () => (
    <div className="space-y-5">
      {[CREATE_STEP_COUNT, ONBOARDING_STEP_COUNT].map((total) => (
        <div key={total} className="space-y-2">
          <p className="text-xs text-muted-foreground">{total} steps</p>
          {Array.from({ length: total }, (_, i) => (
            <StepIndicator key={i} currentStep={i + 1} totalSteps={total} />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** Paired with its caption, the way the event form uses it. */
export const WithCaption: Story = {
  render: () => (
    <div className="space-y-2">
      <StepIndicator currentStep={1} totalSteps={CREATE_STEP_COUNT} />
      <p className="text-xs text-muted-foreground">Step 1 of {CREATE_STEP_COUNT} · Details</p>
    </div>
  ),
};
