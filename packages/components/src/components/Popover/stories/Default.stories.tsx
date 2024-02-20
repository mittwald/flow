import type { Meta, StoryObj } from "@storybook/react";
import Popover from "../Popover";
import React from "react";
import * as Aria from "react-aria-components";
import Button from "@/components/Button";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  render: (props) => (
    <Aria.DialogTrigger>
      <Button>Trigger popover</Button>
      <Popover placement="bottom right">I am a popover.</Popover>
    </Aria.DialogTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {};
