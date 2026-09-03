import type { Meta, StoryObj } from "@storybook/react";
import { Message } from "@/components/Message";
import { Header } from "@/components/Header";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import { Button } from "@/components/Button";
import MenuItem from "@/components/MenuItem";
import { Combine } from "@/components/Combine";
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
            <MenuItem>Edit</MenuItem>
            <MenuItem>Delete</MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
        <Combine>
          <Avatar>
            <Initials>Leia Organa</Initials>
          </Avatar>
          <Text>
            <strong>Leia Organa</strong>
            <span>Rebel Commander</span>
          </Text>
        </Combine>
        <Text>01.09.2024, 12:45</Text>
      </Header>

      <Content>
        <Text>The Death Star plans are in transit.</Text>
      </Content>
      <Button>Reply</Button>
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
        <Text>The Death Star plans are in transit.</Text>
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
        <Text>The Death Star plans are in transit.</Text>
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
