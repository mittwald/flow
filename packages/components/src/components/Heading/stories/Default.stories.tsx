import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";

const meta: Meta<typeof Heading> = {
  title: "Heading",
  component: Heading,
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: {
    children: "Heading",
  },
};
