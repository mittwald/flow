import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PrimaryNavigation } from "@/components/mstudio/PrimaryNavigation/PrimaryNavigation";
import { storyBackgroundDark } from "@/lib/dev/storyBackgrounds";
import { SecondaryNavigation } from "@/components/mstudio/SecondaryNavigation/SecondaryNavigation";

const meta: Meta = {
  title: "mStudio",
  render: () => {
    return (
      <div style={{ height: "500px" }}>
        <PrimaryNavigation />
      </div>
    );
  },
  parameters: {
    backgrounds: storyBackgroundDark,
  },
};
export default meta;

type Story = StoryObj;

export const Primary: Story = {};
export const PrimaryCollapsed: Story = {
  render: () => {
    return (
      <div style={{ height: "500px" }}>
        <PrimaryNavigation collapsed />
      </div>
    );
  },
};

export const Secondary: Story = {
  render: () => {
    return <SecondaryNavigation />;
  },
};
