import type { Meta, StoryObj } from "@storybook/react";
import LabeledValue from "../LabeledValue";
import { Label } from "@/components/Label";
import { Content } from "@/components/Content";
import { CopyButton } from "@/components/CopyButton";
import { Button } from "@/components/Button";
import { InlineCode } from "@/components/InlineCode";
import { Link } from "@/components/Link";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";

const meta: Meta<typeof LabeledValue> = {
  title: "Content/LabeledValue",
  component: LabeledValue,
  parameters: {
    controls: { disable: true },
  },
  render: (props) => (
    <LabeledValue {...props}>
      <Label>Starship</Label>
      <Content>Millennium Falcon</Content>
    </LabeledValue>
  ),
};
export default meta;

type Story = StoryObj<typeof LabeledValue>;

export const Default: Story = {};

export const WithInlineCode: Story = {
  render: (props) => (
    <LabeledValue {...props}>
      <Label>IP address</Label>
      <InlineCode>127.0.0.1</InlineCode>
      <CopyButton text="127.0.0.1" />
    </LabeledValue>
  ),
};

export const WithLink: Story = {
  render: (props) => (
    <LabeledValue {...props}>
      <Label>Domain</Label>
      <Link>https://mittwald.de</Link>
      <CopyButton text="https://mittwald.de" />
    </LabeledValue>
  ),
};

export const WithButton: Story = {
  render: (props) => (
    <LabeledValue {...props}>
      <Label>Support pin</Label>
      <Button variant="soft" color="secondary">
        Generate
      </Button>
    </LabeledValue>
  ),
};

export const WithContextualHelp: Story = {
  render: (props) => (
    <LabeledValue>
      <Label>
        Role
        <ContextualHelpTrigger>
          <Button />
          <ContextualHelp {...props}>
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
      <Text>Jedi Master</Text>
    </LabeledValue>
  ),
};
