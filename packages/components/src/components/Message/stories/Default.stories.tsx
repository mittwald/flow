import type { Meta, StoryObj } from "@storybook/react";
import { Message } from "@/components/Message";
import { Header } from "@/components/Header";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import { Button } from "@/components/Button";
import MenuItem from "@/components/MenuItem";
import { Align } from "@/components/Align";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";

const meta: Meta<typeof Message> = {
  title: "Chat/Message",
  component: Message,
  parameters: {
    controls: { exclude: ["className"] },
  },
  render: (props) => (
    <Message {...props}>
      <Header>
        <ContextMenuTrigger>
          <Button />
          <ContextMenu>
            <MenuItem>Bearbeiten</MenuItem>
            <MenuItem>Löschen</MenuItem>
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

export const Sender: Story = { args: { type: "sender" } };

export const MessageOnly: Story = {
  render: (props) => (
    <Message {...props}>
      <Content>
        <Text>Das ist eine Nachricht</Text>
      </Content>
    </Message>
  ),
};

export const CustomColor: Story = {
  args: { color: "#ffeedd" },
};

export const SenderCustomColor: Story = {
  args: { type: "sender", color: "#ffeedd" },
};
