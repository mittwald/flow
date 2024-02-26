import type { Meta, StoryObj } from "@storybook/react";
import Tooltip, { TooltipTrigger } from "../index";
import React from "react";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Tooltip> = {
  ...defaultMeta,
  title: "Overlays/Tooltip/Edge Cases",
  args: {
    defaultOpen: true,
  },
  render: (props) => (
    <TooltipTrigger {...props}>
      <Button aria-label="copy">
        <Icon tablerIcon="copy" />
      </Button>
      <Tooltip>{dummyText.medium}</Tooltip>
    </TooltipTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof Text>;

export const LongText: Story = {};
