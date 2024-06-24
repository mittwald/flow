import type { Meta, StoryObj } from "@storybook/react";
import Popover from "../Popover";
import React from "react";
import Button from "@/components/Button";
import { PopoverTrigger } from "@/components/Popover";
import { useOverlayController } from "@/lib/controller";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  render: (props) => (
    <PopoverTrigger>
      <Button>Trigger popover</Button>
      <Popover {...props} placement="bottom right">
        I am a popover.
      </Popover>
    </PopoverTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {};

export const WithTip: Story = { args: { withTip: true } };

export const WithController: Story = {
  render: (props) => {
    const controller = useOverlayController("Popover");
    const triggerRef = React.useRef(null);

    return (
      <>
        <Button ref={triggerRef} onPress={controller.open}>
          Trigger popover
        </Button>
        <Popover triggerRef={triggerRef} {...props} controller={controller}>
          I am a popover.
        </Popover>
      </>
    );
  },
};
