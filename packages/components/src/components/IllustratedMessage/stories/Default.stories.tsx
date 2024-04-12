import type { Meta, StoryObj } from "@storybook/react";
import IllustratedMessage from "../IllustratedMessage";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { IconApp, IconDanger } from "@/components/Icon/components/icons";

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
    variant: {
      control: "inline-radio",
    },
  },
  args: { variant: "info" },
};
export default meta;

type Story = StoryObj<typeof IllustratedMessage>;

export const Default: Story = {};

export const Negative: Story = {
  render: (props) => (
    <IllustratedMessage {...props} variant="negative">
      <IconDanger />
      <Heading>No access</Heading>
      <Text>You do not have the required permissions to access this page.</Text>
      <Button>Go back</Button>
    </IllustratedMessage>
  ),
};
