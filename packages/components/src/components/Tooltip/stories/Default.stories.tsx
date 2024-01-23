import type { Meta, StoryObj } from "@storybook/react";
import Tooltip, { TooltipTrigger } from "../index";
import React from "react";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { faCopy } from "@fortawesome/free-regular-svg-icons/faCopy";

const meta: Meta<typeof Tooltip> = {
  title: "Overlays/Tooltip",
  component: Tooltip,
  render: () => (
    <TooltipTrigger>
      <Button aria-label="copy">
        <Icon faIcon={faCopy} />
      </Button>
      <Tooltip>Copy</Tooltip>
    </TooltipTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {};
