import type { Meta, StoryObj } from "@storybook/react";
import Tooltip, { TooltipTrigger } from "../index";
import React from "react";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import defaultMeta from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";
import { faSave } from "@fortawesome/free-regular-svg-icons/faSave";

const meta: Meta<typeof Tooltip> = {
  ...defaultMeta,
  title: "Overlays/Tooltip/Edge Cases",
  render: () => (
    <TooltipTrigger>
      <Button aria-label="save">
        <Icon faIcon={faSave} />
      </Button>
      <Tooltip>{dummyText.medium}</Tooltip>
    </TooltipTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof Text>;

export const LongText: Story = {};
