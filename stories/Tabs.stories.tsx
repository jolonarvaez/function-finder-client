import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AlarmClock, Book } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-200 bg-background p-6 flex items-center justify-center min-h-32">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-100">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  ),
};

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-100">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content.</TabsContent>
      <TabsContent value="analytics">Analytics content.</TabsContent>
      <TabsContent value="reports">Reports content.</TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="account" orientation="vertical" className="w-100">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings content.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
      <TabsContent value="notifications">Manage notifications.</TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="home" className="w-100">
      <TabsList>
        <TabsTrigger value="home">Home</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
      </TabsList>
      <TabsContent value="home">Home content.</TabsContent>
    </Tabs>
  ),
};

export const Icons: Story = {
  render: () => (
    <Tabs defaultValue="preview" className="w-100">
      <TabsList>
        <TabsTrigger value="preview">
          <AlarmClock />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <Book />
          Code
        </TabsTrigger>
      </TabsList>
      <TabsContent value="preview">Rendered preview.</TabsContent>
      <TabsContent value="code">Source code.</TabsContent>
    </Tabs>
  ),
};
