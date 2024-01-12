import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../index";
import React from "react";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof Switch> = {
  title: "Switch",
  component: Switch,
  args: {
    onChange: action("onChange"),
  },
  render: (props) => <Switch {...props}>Autoresponder</Switch>,
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const LabelLeading: Story = { args: { labelPosition: "leading" } };

export const Disabled: Story = { args: { isDisabled: true } };
