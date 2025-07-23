import type { Meta, StoryObj } from "@storybook/react";
import { NumberField } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";

const meta: Meta<typeof NumberField> = {
  title: "Form Controls/NumberField/Edge Cases",
  component: NumberField,
  render: (props) => (
    <NumberField onChange={action("onChange")} {...props}>
      <Label>Age</Label>
    </NumberField>
  ),
};

export default meta;

type Story = StoryObj<typeof NumberField>;

export const WithDisabledDecrement: Story = {
  args: { minValue: 5, defaultValue: 5 },
};

export const WithDisabledIncrement: Story = {
  args: { maxValue: 5, defaultValue: 5 },
};
