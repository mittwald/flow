import type { Meta, StoryObj } from "@storybook/react";
import Tooltip, { TooltipTrigger } from "../index";
import React from "react";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { faCopy } from "@fortawesome/free-regular-svg-icons/faCopy";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Tooltip> = {
  ...defaultMeta,
  title: "Overlays/Tooltip/Edge Cases",
  render: () => (
    <TooltipTrigger>
      <Button aria-label="copy">
        <Icon faIcon={faCopy} />
      </Button>
      <Tooltip>{dummyText.medium}</Tooltip>
    </TooltipTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const LongText: Story = {};
