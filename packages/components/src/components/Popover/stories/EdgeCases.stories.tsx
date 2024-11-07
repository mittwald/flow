import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Popover, PopoverTrigger } from "@/components/Popover";
import Button from "@/components/Button";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Popover> = {
  ...defaultMeta,
  title: "Overlays/Popover/Edge Cases",
  component: Popover,
};

export default meta;

type Story = StoryObj<typeof Popover>;

export const LongContent: Story = {
  render: (props) => (
    <PopoverTrigger>
      <Button>Trigger popover</Button>
      <Popover {...props} placement="bottom right">
        {dummyText.long}
        {dummyText.long}
        {dummyText.long}
      </Popover>
    </PopoverTrigger>
  ),
};
