import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ShortcutKey } from "@/components/ShortcutKey";

const meta: Meta<typeof ShortcutKey> = {
  title: "Content/ShortcutKey",
  component: ShortcutKey,
  render: (props) => <ShortcutKey {...props}>mod + k</ShortcutKey>,
  args: {
    isDisabled: false,
    keys: ["mod", "k"],
  },
  argTypes: {
    isDisabled: {
      control: "boolean",
    },
  },
  parameters: {
    controls: { exclude: ["keys"] },
  },
};
export default meta;

type Story = StoryObj<typeof ShortcutKey>;

export const Default: Story = {};
