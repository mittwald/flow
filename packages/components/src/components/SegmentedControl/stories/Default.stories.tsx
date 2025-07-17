import type { Meta, StoryObj } from "@storybook/react";
import { Segment, SegmentedControl } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof SegmentedControl> = {
  title: "Form Controls/SegmentedControl",
  component: SegmentedControl,
  args: {
    onChange: action("onChange"),
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <SegmentedControl {...props} defaultValue="admin">
      <Label>Role</Label>
      <Segment value="admin">Admin</Segment>
      <Segment value="member">Member</Segment>
      <Segment value="accountant">Accountant</Segment>
    </SegmentedControl>
  ),
};

export default meta;

type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {};

export const CustomContainerBreakpoint: Story = {
  render: (props) => (
    <SegmentedControl
      {...props}
      defaultValue="admin"
      containerBreakpointSize="xs"
    >
      <Label>Role</Label>
      <Segment value="admin">Admin</Segment>
      <Segment value="member">Member</Segment>
    </SegmentedControl>
  ),
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const WithFieldError: Story = {
  render: (props) => (
    <SegmentedControl {...props} isInvalid isRequired>
      <Label>Role</Label>
      <Segment value="admin">Admin</Segment>
      <Segment value="member">Member</Segment>
      <Segment value="accountant">Accountant</Segment>
      <FieldError>Select a role to continue</FieldError>
    </SegmentedControl>
  ),
};

export const DisabledSegments: Story = {
  render: (props) => (
    <SegmentedControl {...props}>
      <Label>Role</Label>
      <Segment value="admin">Admin</Segment>
      <Segment value="member" isDisabled>
        Member
      </Segment>
      <Segment value="accountant">Accountant</Segment>
    </SegmentedControl>
  ),
};
