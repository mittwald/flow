import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../Heading";
import defaultMeta from "./Default.stories";
import { IconMember } from "@/components/Icon/components/icons";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import { AlertBadge } from "@/components/AlertBadge";
import ContextualHelpTrigger from "../../ContextualHelp/components/ContextualHelpTrigger";
import { Button } from "@/components/Button";
import { ContextualHelp } from "@/components/ContextualHelp";
import { Text } from "@/components/Text";

const meta: Meta<typeof Heading> = {
  ...defaultMeta,
  title: "Content/Heading/Edge Cases",
  component: Heading,
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const LongText: Story = {
  render: (props) => (
    <Heading {...props}>
      <IconMember />
      {dummyText.medium}
    </Heading>
  ),
};

export const WithAlertBadge: Story = {
  render: (props) => (
    <Heading {...props}>
      <IconMember />
      {dummyText.long}
      <AlertBadge>Alert</AlertBadge>
    </Heading>
  ),
};

export const WithContextualHelp: Story = {
  render: (props) => (
    <Heading {...props}>
      {dummyText.long}
      <ContextualHelpTrigger>
        <Button />
        <ContextualHelp {...props}>
          <Text>{dummyText.medium}</Text>
        </ContextualHelp>
      </ContextualHelpTrigger>
    </Heading>
  ),
};
