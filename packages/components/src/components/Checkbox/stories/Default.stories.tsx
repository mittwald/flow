import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../index";
import React from "react";
import { action } from "@storybook/addon-actions";
import { Text } from "@/components/Text";
import { Content } from "@/components/Content";

const meta: Meta<typeof Checkbox> = {
  title: "Checkbox",
  component: Checkbox,
  args: {
    onChange: action("onChange"),
  },
  render: (props) => <Checkbox {...props}>checkbox</Checkbox>,
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const DisabledSelected: Story = {
  args: { isDisabled: true, defaultSelected: true },
};

export const WithContent: Story = {
  render: (props) => (
    <Checkbox {...props}>
      <Text>checkbox</Text>
      <Content>checkbox content</Content>
    </Checkbox>
  ),
};
