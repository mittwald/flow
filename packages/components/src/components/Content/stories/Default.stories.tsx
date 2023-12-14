import type { Meta, StoryObj } from "@storybook/react";
import Content from "../Content";

const meta: Meta<typeof Content> = {
  title: "Content",
  component: Content,
};
export default meta;

type Story = StoryObj<typeof Content>;

export const Default: Story = {
  args: {
    children: "Content",
  },
};
