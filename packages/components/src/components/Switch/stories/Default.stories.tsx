import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../index";
import React from "react";
import { action } from "storybook/actions";
import { Label } from "@/components/Label";

const meta: Meta<typeof Switch> = {
  title: "Form Controls/Switch",
  component: Switch,
  args: {
    onChange: action("onChange"),
    labelPosition: "trailing",
    isDisabled: false,
    isReadOnly: false,
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
  render: (props) => (
    <Switch {...props}>
      <Label>Autoresponder</Label>
    </Switch>
  ),
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const LabelLeading: Story = { args: { labelPosition: "leading" } };
