import type { Meta, StoryObj } from "@storybook/react";
import Text from "../Text";
import React from "react";

const meta: Meta<typeof Text> = {
  title: "Content/Text",
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
  },
  render: (props) => (
    <Text {...props}>
      Text is an unstyled component that can be used to display texts. By
      default it renders a span.
    </Text>
  ),
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {};
