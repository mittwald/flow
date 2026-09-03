import type { Meta, StoryObj } from "@storybook/react";
import Label from "../Label";
import { Button } from "@/components/Button";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";

const meta: Meta<typeof Label> = {
  title: "Content/Label",
  component: Label,
  args: { optional: false },
  render: (props) => <Label {...props}>Label</Label>,
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const WithButton: Story = {
  render: (props) => (
    <Label {...props}>
      <Text>Label</Text>
      <Button>Engage hyperdrive</Button>
    </Label>
  ),
};

export const WithContextualHelp: Story = {
  render: (props) => (
    <Label {...props}>
      <Text>Label</Text>
      <ContextualHelpTrigger>
        <Button />
        <ContextualHelp>
          <Heading>Ranks & roles</Heading>
          <Text>
            Each crew member is assigned a rank in your fleet for each mission
            and/or squadron. This lets you command in a completely new and
            modern way.
          </Text>
          <Link>Learn more</Link>
        </ContextualHelp>
      </ContextualHelpTrigger>
    </Label>
  ),
};
