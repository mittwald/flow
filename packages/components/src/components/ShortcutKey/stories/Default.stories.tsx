import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ShortcutKey } from "@/components/ShortcutKey";

const meta: Meta<typeof ShortcutKey> = {
  title: "Content/ShortcutKey",
  component: ShortcutKey,
  render: () => <ShortcutKey>k</ShortcutKey>,
};
export default meta;

type Story = StoryObj<typeof ShortcutKey>;

export const Default: Story = {};
