import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "~/components/ContextualHelp";
import { Heading } from "~/components/Heading";
import { Text } from "~/components/Text";
import { Link } from "~/components/Link";
import { Button } from "~/components/Button";

const meta: Meta<typeof ContextualHelp> = {
  title: "Overlays/ContextualHelp",
  component: ContextualHelp,
  render: (props) => (
    <ContextualHelpTrigger>
      <Button />
      <ContextualHelp {...props}>
        <Heading>Rights & roles</Heading>
        <Text>
          Each user profile is assigned a role in mStudio for each project
          and/or organization. This allows you to work in a completely new and
          modern way.
        </Text>
        <Link>Learn more</Link>
      </ContextualHelp>
    </ContextualHelpTrigger>
  ),
};
export default meta;

type Story = StoryObj<typeof ContextualHelp>;

export const Default: Story = {};
