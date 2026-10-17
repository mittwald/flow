"use client";
import { ComponentGroupPage } from "@/app/remote/components/_lib/ComponentGroupPage";
import {
  Avatar,
  Button,
  Chat,
  Combine,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  Header,
  Heading,
  Initials,
  MenuItem,
  Message,
  MessageSeparator,
  MessageThread,
  Section,
  Text,
  TextArea,
} from "@mittwald/flow-remote-react-components";
import { useState } from "react";

const MessageHeader = (props: { name: string; role: string }) => (
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
        <Initials>{props.name}</Initials>
      </Avatar>
      <Text>
        <strong>{props.name}</strong>
        {props.role}
      </Text>
    </Combine>
  </Header>
);

/**
 * `Chat` composes `MessageThread` and `Message`, so one example covers all
 * three.
 */
export default function Page() {
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState<string[]>([]);

  const send = () => {
    if (draft.trim()) {
      setSent((messages) => [...messages, draft]);
      setDraft("");
    }
  };

  return (
    <ComponentGroupPage title="Chat">
      <Section>
        <Heading level={3}>Chat</Heading>
        <Chat height={400}>
          <MessageThread>
            <MessageSeparator>Transmission opened</MessageSeparator>
            <Message>
              <MessageHeader name="Leia Organa" role="Princess of Alderaan" />
              <Content>
                <Text>
                  The plans are in the droid. Get them to my father on Alderaan.
                </Text>
              </Content>
            </Message>
            {sent.map((text, index) => (
              <Message key={index} type="sender">
                <MessageHeader name="Obi-Wan Kenobi" role="Jedi Master" />
                <Content>
                  <Text>{text}</Text>
                </Content>
              </Message>
            ))}
          </MessageThread>
          <TextArea
            aria-label="Message"
            rows={3}
            autoResizeMaxRows={10}
            value={draft}
            onChange={setDraft}
          />
          <Button color="success" onPress={send}>
            Send
          </Button>
        </Chat>
      </Section>
    </ComponentGroupPage>
  );
}
