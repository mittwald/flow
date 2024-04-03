import type { Meta, StoryObj } from "@storybook/react";
import { Segment, SegmentedButton } from "../index";
import React from "react";
import { Content } from "@/components/Content";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { IconApp, IconDomain } from "@/components/Icon/components/icons";
import { action } from "@storybook/addon-actions";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof SegmentedButton> = {
  title: "Actions/SegmentedButton",
  component: SegmentedButton,
  args: {
    onChange: action("onChange"),
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <SegmentedButton {...props} defaultValue="admin">
      <Label>Role</Label>
      <Segment value="admin">Admin</Segment>
      <Segment value="member">Member</Segment>
      <Segment value="accountant">Accountant</Segment>
    </SegmentedButton>
  ),
};

export default meta;

type Story = StoryObj<typeof SegmentedButton>;

export const Default: Story = {};

export const SegmentedButtonDisabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const SegmentDisabled: Story = {
  render: (props) => (
    <SegmentedButton {...props} defaultValue="admin">
      <Label>Role</Label>
      <Segment value="admin">Admin</Segment>
      <Segment value="member" isDisabled>
        Member
      </Segment>
      <Segment value="accountant">Accountant</Segment>
    </SegmentedButton>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <SegmentedButton {...props} isInvalid isRequired>
      <Label>App</Label>
      <Segment value="wordpress">
        <IconApp />
        <Text>WordPress</Text>
      </Segment>
      <Segment value="typo3">
        <IconApp />
        <Text>TYPO3</Text>
      </Segment>
      <Segment value="magento">
        <IconApp />
        <Text>Magento</Text>
      </Segment>
      <FieldError>Select an app to continue</FieldError>
    </SegmentedButton>
  ),
};
