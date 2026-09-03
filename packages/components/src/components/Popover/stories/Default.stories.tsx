import type { Meta, StoryObj } from "@storybook/react";
import Popover from "../Popover";
import React from "react";
import Button from "@/components/Button";
import { PopoverTrigger } from "@/components/Popover";
import { useOverlayController } from "@/lib/controller";

const meta: Meta<typeof Popover> = {
  title: "Overlays/Popover",
  component: Popover,
  parameters: {
    controls: { disable: true },
  },
  render: (props) => (
    <PopoverTrigger>
      <Button>Trigger popover</Button>
      <Popover {...props} placement="bottom right">
        These aren't the droids you're looking for.
      </Popover>
    </PopoverTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {};

export const CustomWidth: Story = { args: { width: 800 } };

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
          These aren't the droids you're looking for.
        </Popover>
      </>
    );
  },
};
