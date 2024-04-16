import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ContextMenu, {
  MenuItem,
  ContextMenuTrigger,
} from "@/components/ContextMenu";
import { Button } from "@/components/Button";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof ContextMenu> = {
  ...defaultMeta,
  title: "Actions/ContextMenu/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const LongTexts: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <MenuItem>{dummyText.medium}</MenuItem>
        <MenuItem>{dummyText.medium}</MenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};

export const LongList: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        {Array(20)
          .fill("")
          .map((value, index) => (
            <MenuItem>Item {index + 1}</MenuItem>
          ))}
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};
