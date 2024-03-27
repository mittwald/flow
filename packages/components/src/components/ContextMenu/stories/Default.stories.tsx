import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ContextMenu, {
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ContextMenu";
import { Button } from "@/components/Button";

const meta: Meta<typeof ContextMenu> = {
  title: "Actions/ContextMenu",
  component: ContextMenu,
  render: (props) => (
    <ContextMenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <ContextMenuItem>Item 1</ContextMenuItem>
        <ContextMenuItem>Item 2</ContextMenuItem>
        <ContextMenuItem>Item 3</ContextMenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {};
