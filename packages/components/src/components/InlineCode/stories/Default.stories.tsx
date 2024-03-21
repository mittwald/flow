import type { Meta, StoryObj } from "@storybook/react";
import InlineCode from "../InlineCode";
import React from "react";
import { Text } from "@/components/Text";

const meta: Meta<typeof InlineCode> = {
  title: "Content/InlineCode",
  component: InlineCode,
  render: (props) => (
    <Text>
      Enter <InlineCode {...props}>yarn start</InlineCode> to start your app.
    </Text>
  ),
};
export default meta;

type Story = StoryObj<typeof InlineCode>;

export const Default: Story = {};
