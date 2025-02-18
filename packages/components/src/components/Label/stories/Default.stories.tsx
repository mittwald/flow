import type { Meta, StoryObj } from "@storybook/react";
import Label from "../Label";
import React from "react";
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
  render: (props) => <Label {...props}>Label</Label>,
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const Optional: Story = { args: { optional: true } };

export const WithContextualHelp: Story = {
  render: (props) => (
    <Label {...props}>
      <Text>Label</Text>
      <ContextualHelpTrigger>
        <Button />
        <ContextualHelp>
          <Heading>Rights & roles</Heading>
          <Text>
            Each user profile is assigned a role in mStudio for each project
            and/or organization. This allows you to work in a completely new and
            modern way.
          </Text>
          <Link>Learn more</Link>
        </ContextualHelp>
      </ContextualHelpTrigger>
    </Label>
  ),
};

export const OptionalWithContextualHelp: Story = {
  args: { optional: true },
  render: (props) => (
    <Label {...props}>
      <Text>Label</Text>
      <ContextualHelpTrigger>
        <Button />
        <ContextualHelp>
          <Heading>Rights & roles</Heading>
          <Text>
            Each user profile is assigned a role in mStudio for each project
            and/or organization. This allows you to work in a completely new and
            modern way.
          </Text>
          <Link>Learn more</Link>
        </ContextualHelp>
      </ContextualHelpTrigger>
    </Label>
  ),
};
