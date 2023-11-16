import type { Meta, StoryObj } from "@storybook/react";
import Slider from "./Slider.js";

const meta: Meta<typeof Slider> = {
  component: Slider,
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Basic: Story = {};

export const Primary: Story = {
  args: {
    foo: true,
  },
};
