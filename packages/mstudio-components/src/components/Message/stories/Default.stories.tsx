import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Message } from "@/components/Message";
import { Content } from "@mittwald/flow-react-components/Content";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@mittwald/flow-react-components/ContextMenu";
import Button from "@mittwald/flow-react-components/Button";
import { MenuItem } from "@mittwald/flow-react-components/MenuItem";
import { Avatar } from "@mittwald/flow-react-components/Avatar";
import { Initials } from "@mittwald/flow-react-components/Initials";
import { Text } from "@mittwald/flow-react-components/Text";
import { Header } from "@mittwald/flow-react-components/Header";
import { Align } from "@/components/Align";

const meta: Meta<typeof Message> = {
  title: "Message",
  component: Message,
  render: (props) => (
    <Message {...props}>
      <Header>
        <ContextMenuTrigger>
          <Button />
          <ContextMenu>
            <MenuItem>Item 1</MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
        <Align>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
          <Text>
            <b>Max Mustermann</b>
            Organisationsinhaber
          </Text>
        </Align>
        <Text>01.09.2024, 12:45</Text>
      </Header>

      <Content>
        <Text>Das ist eine Nachricht</Text>
      </Content>
    </Message>
  ),
};
export default meta;

type Story = StoryObj<typeof Message>;

export const Default: Story = {};

export const Responder: Story = { args: { type: "responder" } };

export const Internal: Story = { args: { type: "internal" } };

export const MessageOnly: Story = {
  args: { type: "internal" },
  render: (props) => (
    <Message {...props}>
      <Content>
        <Text>Das ist eine Nachricht</Text>
      </Content>
    </Message>
  ),
};

export const OrientationRight: Story = { args: { orientation: "right" } };

export const Shared: Story = { args: { shared: true } };
