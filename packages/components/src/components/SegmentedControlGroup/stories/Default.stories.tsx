import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControlGroup } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { IconApp } from "@/components/Icon/components/icons";
import { action } from "@storybook/addon-actions";
import { FieldError } from "@/components/FieldError";
import { Radio } from "@/components/RadioGroup";

const meta: Meta<typeof SegmentedControlGroup> = {
  title: "Actions/SegmentedControlGroup",
  component: SegmentedControlGroup,
  args: {
    onChange: action("onChange"),
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <SegmentedControlGroup {...props} defaultValue="admin" aria-label="Role">
      <Radio value="admin">Admin</Radio>
      <Radio value="member">Member</Radio>
      <Radio value="accountant">Accountant</Radio>
    </SegmentedControlGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof SegmentedControlGroup>;

export const Default: Story = {};

export const SegmentedControlGroupDisabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const SegmentDisabled: Story = {
  render: (props) => (
    <SegmentedControlGroup {...props} defaultValue="admin" aria-label="Role">
      <Radio value="admin">Admin</Radio>
      <Radio value="member" isDisabled>
        Member
      </Radio>
      <Radio value="accountant">Accountant</Radio>
    </SegmentedControlGroup>
  ),
};
