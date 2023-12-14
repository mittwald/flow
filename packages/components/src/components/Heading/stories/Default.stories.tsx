import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";

const meta: Meta<typeof Heading> = {
  title: "Heading",
  component: Heading,
  argTypes: {
    level: {
      control: "inline-radio",
      options: [1, 2, 3, 4, 5, 6],
      defaultValue: 3,
    },
  },
  args: { level: 3 },
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: {
    children: "Heading",
  },
};
