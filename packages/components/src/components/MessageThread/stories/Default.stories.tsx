import type { Meta, StoryObj } from "@storybook/react";
import type { FC } from "react";
import React from "react";
import type { MessageProps } from "@/components/Message";
import { Message } from "@/components/Message";
import { MessageSeparator, MessageThread } from "@/components/MessageThread";
import { Header } from "@/components/Header";
import { Align } from "@/components/Align";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import { Text } from "@/components/Text";
import { Content } from "@/components/Content";
import { dummyText } from "@/lib/dev/dummyText";

interface ExampleMessageProps extends Pick<MessageProps, "type"> {
  name: string;
  content: string;
}
const ExampleMessage: FC<ExampleMessageProps> = (props) => {
  const { name, content, ...rest } = props;
  return (
    <Message {...rest}>
      <Header>
        <Align>
          <Avatar>
            <Initials>{name}</Initials>
          </Avatar>
          <Text>
            <b>{name}</b>
          </Text>
        </Align>
      </Header>

      <Content>
        <Text>{content}</Text>
      </Content>
    </Message>
  );
};

const meta: Meta<typeof MessageThread> = {
  title: "Chat/MessageThread",
  component: MessageThread,
  render: (props) => (
    <MessageThread {...props}>
      <ExampleMessage
        name="Max Mustermann"
        content={dummyText.medium}
        type="sender"
      />

      <ExampleMessage
        name="John Doe"
        content={dummyText.long}
        type="responder"
      />

      <MessageSeparator {...props}>Conversation closed</MessageSeparator>

      <ExampleMessage
        name="Max Mustermann"
        content={dummyText.short}
        type="sender"
      />
    </MessageThread>
  ),
};
export default meta;

type Story = StoryObj<typeof MessageThread>;

export const Default: Story = {};
