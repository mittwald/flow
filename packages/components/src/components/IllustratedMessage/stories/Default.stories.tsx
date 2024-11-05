import type { Meta, StoryObj } from "@storybook/react";
import IllustratedMessage from "../IllustratedMessage";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { IconApp, IconDanger } from "@/components/Icon/components/icons";
import {
  storyBackgroundDark,
  storyBackgroundLight,
} from "@/lib/dev/storyBackgrounds";
import { ActionGroup } from "@/components/ActionGroup";

const meta: Meta<typeof IllustratedMessage> = {
  title: "Content/Illustrated Message",
  component: IllustratedMessage,
  render: (props) => (
    <IllustratedMessage {...props}>
      <IconApp />
      <Heading>No apps installed</Heading>
      <Text>Create your first app to start working on your website.</Text>
      <Button>Create app</Button>
    </IllustratedMessage>
  ),
  argTypes: {
    color: {
      control: "inline-radio",
    },
  },
  args: { color: "primary" },
};
export default meta;

type Story = StoryObj<typeof IllustratedMessage>;

export const Default: Story = {};

export const Danger: Story = {
  render: (props) => (
    <IllustratedMessage {...props} color="danger">
      <IconDanger />
      <Heading>No access</Heading>
      <Text>You do not have the required permissions to access this page.</Text>
      <Button>Go back</Button>
    </IllustratedMessage>
  ),
};

export const Dark: Story = {
  args: { color: "dark" },
  parameters: {
    backgrounds: storyBackgroundLight,
  },
};

export const Light: Story = {
  args: { color: "light" },
  parameters: {
    backgrounds: storyBackgroundDark,
  },
};

export const WithActionGroup: Story = {
  render: (props) => (
    <IllustratedMessage {...props}>
      <IconApp />
      <Heading>No apps installed</Heading>
      <Text>Create your first app to start working on your website.</Text>
      <ActionGroup>
        <Button variant="soft" color="secondary">
          Go back
        </Button>
        <Button>Create app</Button>
      </ActionGroup>
    </IllustratedMessage>
  ),
};
