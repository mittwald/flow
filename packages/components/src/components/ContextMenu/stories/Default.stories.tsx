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
        <ContextMenuItem id="item1">Item 1</ContextMenuItem>
        <ContextMenuItem id="item2">Item 2</ContextMenuItem>
        <ContextMenuItem id="item3">Item 3</ContextMenuItem>
      </ContextMenu>
    </ContextMenuTrigger>
  ),
  parameters: {
    controls: {
      exclude: ["defaultOpen", "selectionMode", "defaultSelectedKeys"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {};

export const SingleSelection: Story = {
  args: {
    defaultOpen: true,
    selectionMode: "single",
    defaultSelectedKeys: ["item2"],
  },
};

export const MultipleSelection: Story = {
  args: {
    defaultOpen: true,
    selectionMode: "multiple",
    defaultSelectedKeys: ["item2", "item3"],
  },
};
