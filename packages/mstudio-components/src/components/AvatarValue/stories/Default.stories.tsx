import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Avatar } from "@mittwald/flow-react-components/Avatar";
import { Initials } from "@mittwald/flow-react-components/Initials";
import { Text } from "@mittwald/flow-react-components/Text";
import { AvatarValue } from "@/components/AvatarValue";

const meta: Meta<typeof AvatarValue> = {
  title: "AvatarValue",
  component: AvatarValue,
  render: (props) => (
    <AvatarValue {...props}>
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Text>
        <b>Max Mustermann</b>
        Organisationsinhaber
      </Text>
    </AvatarValue>
  ),
};
export default meta;

type Story = StoryObj<typeof AvatarValue>;

export const Default: Story = {};

export const Multiline: Story = {
  render: (props) => (
    <AvatarValue {...props}>
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Text>
        <b>Max Mustermann</b>
        Organisationsinhaber
        <br />
        max@mustermann.de
        <br />
        0163/123456789
      </Text>
    </AvatarValue>
  ),
};

export const Singleline: Story = {
  render: (props) => (
    <AvatarValue {...props}>
      <Avatar>
        <Initials>Max Mustermann</Initials>
      </Avatar>
      <Text>
        <b>Max Mustermann</b>
      </Text>
    </AvatarValue>
  ),
};
