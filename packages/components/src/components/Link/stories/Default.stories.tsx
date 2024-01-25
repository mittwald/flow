import type { Meta, StoryObj } from "@storybook/react";
import Link from "../Link";
import { action } from "@storybook/addon-actions";
import React from "react";

const meta: Meta<typeof Link> = {
  title: "Navigation/Link",
  component: Link,
  args: {
    onPress: action("onPress"),
  },
  render: (props) => <Link {...props}>Link</Link>,
  argTypes: {
    variant: {
      control: "inline-radio",
      defaultValue: "default",
    },
  },
  parameters: {
    controls: { exclude: ["onPress"] },
  },
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const Danger: Story = {
  args: { variant: "danger" },
};
