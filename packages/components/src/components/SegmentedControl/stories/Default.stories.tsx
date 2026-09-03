import type { Meta, StoryObj } from "@storybook/react";
import { Segment, SegmentedControl } from "../index";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof SegmentedControl> = {
  title: "Form Controls/SegmentedControl",
  component: SegmentedControl,
  args: {
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
  render: (props) => (
    <SegmentedControl
      {...props}
      onChange={action("onChange")}
      defaultValue="admin"
    >
      <Label>Rank</Label>
      <Segment value="admin">Jedi Master</Segment>
      <Segment value="member">Jedi Knight</Segment>
      <Segment value="accountant">Padawan</Segment>
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
      <Label>Rank</Label>
      <Segment value="admin">Jedi Master</Segment>
      <Segment value="member">Jedi Knight</Segment>
    </SegmentedControl>
  ),
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export const WithFieldError: Story = {
  render: (props) => (
    <SegmentedControl {...props} isInvalid isRequired>
      <Label>Rank</Label>
      <Segment value="admin">Jedi Master</Segment>
      <Segment value="member">Jedi Knight</Segment>
      <Segment value="accountant">Padawan</Segment>
      <FieldError>Select a rank to continue</FieldError>
    </SegmentedControl>
  ),
};

export const DisabledSegment: Story = {
  render: (props) => (
    <SegmentedControl {...props} defaultValue="admin">
      <Label>Rank</Label>
      <Segment value="admin">Jedi Master</Segment>
      <Segment value="member" isDisabled>
        Jedi Knight
      </Segment>
      <Segment value="accountant">Padawan</Segment>
    </SegmentedControl>
  ),
};
