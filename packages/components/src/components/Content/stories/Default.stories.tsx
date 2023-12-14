import type { Meta, StoryObj } from "@storybook/react";
import Content from "../Content";

const meta: Meta<typeof Content> = {
  title: "Content",
  component: Content,
  argTypes: {
    elementType: {
      control: "inline-radio",
      options: ["div", "section"],
    },
  },
  args: { elementType: "div" },
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {
  args: {
    children: "Content",
  },
};
