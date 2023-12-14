import type { Meta, StoryObj } from "@storybook/react";
import Text from "../Text";

const meta: Meta<typeof Text> = {
  title: "Text",
  component: Text,
  argTypes: {
    elementType: {
      control: "inline-radio",
      options: ["span", "p"],
      defaultValue: "span",
    },
  },
  args: {
    elementType: "span",
    children: "Text...",
  },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {};
