import type { Meta, StoryObj } from "@storybook/react";
import ContentPlaceholder from "../ContentPlaceholder";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import { IconApp, IconWarning } from "@/components/Icon/components/icons";

const meta: Meta<typeof ContentPlaceholder> = {
  title: "Content/Content Placeholder",
  component: ContentPlaceholder,
  render: (props) => (
    <ContentPlaceholder {...props}>
      <IconApp />
      <Heading>No apps installed</Heading>
      <Text>Create your first app to start working on your website.</Text>
      <Button variant="accent">Create app</Button>
    </ContentPlaceholder>
  ),
  argTypes: {
    variant: {
      control: "inline-radio",
    },
  },
  args: { variant: "info" },
};
export default meta;

type Story = StoryObj<typeof ContentPlaceholder>;

export const Default: Story = {};

export const Danger: Story = {
  render: (props) => (
    <ContentPlaceholder {...props} variant="danger">
      <IconWarning />
      <Heading>No access</Heading>
      <Text>You do not have the required permissions to access this page.</Text>
      <Button variant="accent">Go back</Button>
    </ContentPlaceholder>
  ),
  args: { variant: "danger" },
};
