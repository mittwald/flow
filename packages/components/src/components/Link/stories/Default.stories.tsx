import type { Meta, StoryObj } from "@storybook/react";
import Link from "../Link";
import { action } from "@storybook/addon-actions";
import React from "react";

const meta: Meta<typeof Link> = {
  title: "Link",
  component: Link,
  args: {
    onPress: action("onPress"),
  },
  render: (props) => <Link {...props}>Link</Link>,
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const Negative: Story = {
  args: { variant: "negative" },
};
