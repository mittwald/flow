import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ContextMenu, { ContextMenuItem } from "@/components/ContextMenu";
import * as Aria from "react-aria-components";
import { Button } from "@/components/Button";

const meta: Meta<typeof ContextMenu> = {
  title: "Overlays/ContextMenu",
  component: ContextMenu,
  render: (props) => (
    <Aria.MenuTrigger>
      <Button>Trigger</Button>
      <ContextMenu {...props}>
        <ContextMenuItem>Item 1</ContextMenuItem>
        <ContextMenuItem>Item 2</ContextMenuItem>
        <ContextMenuItem>Item 3</ContextMenuItem>
      </ContextMenu>
    </Aria.MenuTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {};
