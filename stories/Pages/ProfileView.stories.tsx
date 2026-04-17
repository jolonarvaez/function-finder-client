import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProfileView } from "@/components/profile/ProfileView";
import { AuthContext } from "@/components/auth/AuthProvider";

const mockUser = {
  id: "mock-user-id",
  email: "jolo@example.com",
  user_metadata: {
    full_name: "Jolo Narvaez",
    avatar_url: undefined,
    genres: ["House", "Techno", "RnB"],
  },
  app_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
} as const;

const mockAuthValue = {
  user: mockUser as never,
  loading: false,
  signOut: async () => {},
};

const meta: Meta<typeof ProfileView> = {
  title: "Pages/ProfileView",
  component: ProfileView,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-107.5 overflow-hidden bg-background">
        <AuthContext value={mockAuthValue}>
          <Story />
        </AuthContext>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProfileView>;

export const Default: Story = {};
