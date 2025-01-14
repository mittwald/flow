import type { Meta, StoryObj } from "@storybook/react";
import Tooltip, { TooltipTrigger } from "../index";
import React from "react";
import { Button } from "~/components/Button";
import { IconCopy } from "~/components/Icon/components/icons";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  args: {
    defaultOpen: true,
  },
  parameters: {
    controls: { exclude: ["defaultOpen"] },
  },
  render: (props) => (
    <TooltipTrigger {...props}>
      <Button aria-label="copy">
        <IconCopy />
      </Button>
      <Tooltip>Save</Tooltip>
    </TooltipTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {};
