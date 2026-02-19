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
import { ActionGroup } from "@/components/ActionGroup";

const meta: Meta<typeof Message> = {
  title: "Chat/Message",
  component: Message,
  args: { type: "responder" },
  argTypes: {
    type: { control: "inline-radio", options: ["sender", "responder"] },
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
            <strong>Max Mustermann</strong>
            Organisationsinhaber
          </Text>
        </Align>
        <Text>01.09.2024, 12:45</Text>
      </Header>

      <Content>
        <Text>Das ist eine Nachricht</Text>
      </Content>
      <Button>Button</Button>
    </Message>
  ),
};
export default meta;

type Story = StoryObj<typeof Message>;

export const Default: Story = {};

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

export const WithActionGroup: Story = {
  render: (props) => (
    <Message {...props}>
      <Content>
        <Text>Das ist eine Nachricht</Text>
      </Content>
      <ActionGroup>
        <Button slot="secondary" variant="soft" color="secondary">
          Secondary
        </Button>
        <Button>Primary</Button>
      </ActionGroup>
    </Message>
  ),
};
