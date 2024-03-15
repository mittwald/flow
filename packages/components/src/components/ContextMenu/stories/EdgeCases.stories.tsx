import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ContextMenu, {
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ContextMenu";
import { Button } from "@/components/Button";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof ContextMenu> = {
  ...defaultMeta,
  title: "Overlays/ContextMenu/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const LongTexts: Story = {
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <ContextMenuItem>{dummyText.medium}</ContextMenuItem>
        <ContextMenuItem>{dummyText.medium}</ContextMenuItem>
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
            <ContextMenuItem>Item {index + 1}</ContextMenuItem>
          ))}
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};
