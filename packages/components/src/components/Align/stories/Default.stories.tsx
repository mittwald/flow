import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Align } from "@/components/Align";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import { Text } from "@/components/Text";

const meta: Meta<typeof Align> = {
  title: "Structure/Align/Avatar + Text",
  component: Align,
  render: (props) => (
    <Align {...props}>
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Text>
        <strong>Max Mustermann</strong>
        Organisationsinhaber
      </Text>
    </Align>
  ),
};
export default meta;

type Story = StoryObj<typeof Align>;

export const Default: Story = {};

export const Multiline: Story = {
  render: (props) => (
    <Align {...props}>
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Text>
        <strong>Max Mustermann</strong>
        Organisationsinhaber
        <br />
        max@mustermann.de
        <br />
        0163/123456789
      </Text>
    </Align>
  ),
};

export const Singleline: Story = {
  render: (props) => (
    <Align {...props}>
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Text>
        <strong>Max Mustermann</strong>
      </Text>
    </Align>
  ),
};

export const WithoutBoldText: Story = {
  render: (props) => (
    <Align {...props}>
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Text>
        Max Mustermann
        <br />
        Organisationsinhaber
      </Text>
    </Align>
  ),
};
