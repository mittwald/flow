import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../index";
import React from "react";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof Switch> = {
  title: "Switch/Variants",
  component: Switch,
  args: {
    onChange: action("onChange"),
  },
  render: (props) => (
    <Switch defaultSelected {...props}>
      Autoresponder
    </Switch>
  ),
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Accent: Story = {};

export const AccentDisabled: Story = { args: { isDisabled: true } };

export const Negative: Story = {
  args: { variant: "negative" },
};

export const NegativeDisabled: Story = {
  args: { variant: "negative", isDisabled: true },
};
