import type { Meta, StoryObj } from "@storybook/react";
import Tooltip, { TooltipTrigger } from "../index";
import React from "react";
import { Button } from "~/components/Button";
import { IconCopy } from "~/components/Icon/components/icons";
import defaultMeta from "./Default.stories";
import { dummyText } from "~/lib/dev/dummyText";

const meta: Meta<typeof Tooltip> = {
  ...defaultMeta,
  title: "Overlays/Tooltip/Edge Cases",
  args: {
    defaultOpen: true,
  },
  render: (props) => (
    <TooltipTrigger {...props}>
      <Button aria-label="copy">
        <IconCopy />
      </Button>
      <Tooltip>{dummyText.medium}</Tooltip>
    </TooltipTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const LongText: Story = {};
