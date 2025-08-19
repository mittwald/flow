import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../index";
import React from "react";
import { action } from "storybook/actions";

const meta: Meta<typeof Switch> = {
  title: "Form Controls/Switch",
  component: Switch,
  args: {
    onChange: action("onChange"),
    labelPosition: "trailing",
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  argTypes: {
    labelPosition: {
      control: "inline-radio",
      options: ["trailing", "leading"],
    },
  },
  render: (props) => <Switch {...props}>Autoresponder</Switch>,
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const LabelLeading: Story = { args: { labelPosition: "leading" } };

export const Disabled: Story = { args: { isDisabled: true } };
export const ReadOnly: Story = { args: { isReadOnly: true } };
