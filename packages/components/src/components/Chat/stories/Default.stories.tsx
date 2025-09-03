import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Message } from "@/components/Message";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { Align } from "@/components/Align";
import { Avatar } from "@/components/Avatar";
import { Initials } from "@/components/Initials";
import { Content } from "@/components/Content";
import { Text } from "@/components/Text";
import { MessageThread } from "@/components/MessageThread";
import { Chat } from "@/components/Chat";
import { dummyText } from "@/lib/dev/dummyText";
import { TextArea } from "@/components/TextArea";
import { FileCardList } from "@/components/FileCardList";
import { FileCard } from "@/components/FileCard";
import { Field, Form } from "@/integrations/react-hook-form";
import { action } from "storybook/actions";
import { useForm } from "react-hook-form";
import { MarkdownEditor } from "@/components/MarkdownEditor";

const meta: Meta<typeof Chat> = {
  title: "Chat/Chat",
  component: Chat,
  parameters: {
    controls: { exclude: ["className"] },
  },
  args: { height: 400 },
  render: (props) => (
    <Chat {...props}>
      <MessageThread>
        <Message>
          <Header>
            <Align>
              <Avatar>
                <Initials>Max Mustermann</Initials>
              </Avatar>
              <Text>
                <b>Max Mustermann</b>
              </Text>
            </Align>
          </Header>
          <Content>
            <Text>{dummyText.long}</Text>
          </Content>
        </Message>
        <Message type="sender">
          <Header>
            <Align>
              <Avatar>
                <Initials>John Doe</Initials>
              </Avatar>
              <Text>
                <b>John Doe</b>
              </Text>
            </Align>
          </Header>
          <Content>
            <Text>{dummyText.long}</Text>
          </Content>
        </Message>
      </MessageThread>
      <TextArea aria-label="message" rows={3} autoResizeMaxRows={10} />
      <Button color="accent">Submit</Button>
    </Chat>
  ),
};
export default meta;

type Story = StoryObj<typeof Chat>;

export const Default: Story = {};

export const WithUpload: Story = {
  render: (props) => (
    <Chat {...props}>
      <MessageThread>
        <Message>
          <Header>
            <Align>
              <Avatar>
                <Initials>Max Mustermann</Initials>
              </Avatar>
              <Text>
                <b>Max Mustermann</b>
              </Text>
            </Align>
          </Header>
          <Content>
            <Text>{dummyText.long}</Text>
          </Content>
        </Message>
      </MessageThread>
      <TextArea aria-label="message" rows={3} autoResizeMaxRows={10} />
      <Button color="secondary" variant="outline">
        Attach file
      </Button>
      <Button color="accent">Submit</Button>
      <FileCardList>
        <FileCard name="Uploaded File 1" />
        <FileCard name="Uploaded File 2" />
      </FileCardList>
    </Chat>
  ),
};

export const WithForm: Story = {
  render: (props) => {
    const form = useForm();
    return (
      <Chat {...props}>
        <MessageThread>
          <Message>
            <Header>
              <Align>
                <Avatar>
                  <Initials>Max Mustermann</Initials>
                </Avatar>
                <Text>
                  <b>Max Mustermann</b>
                </Text>
              </Align>
            </Header>
            <Content>
              <Text>{dummyText.long}</Text>
            </Content>
          </Message>
        </MessageThread>
        <Form
          form={form}
          onSubmit={() => {
            action("submitted");
          }}
        >
          <Field name="message">
            <TextArea aria-label="message" rows={3} autoResizeMaxRows={10} />
          </Field>
          <Button color="accent">Submit</Button>
        </Form>
      </Chat>
    );
  },
};

export const WithMarkdownEditor: Story = {
  render: (props) => (
    <Chat {...props}>
      <MessageThread>
        <Message>
          <Header>
            <Align>
              <Avatar>
                <Initials>Max Mustermann</Initials>
              </Avatar>
              <Text>
                <b>Max Mustermann</b>
              </Text>
            </Align>
          </Header>
          <Content>
            <Text>{dummyText.long}</Text>
          </Content>
        </Message>
      </MessageThread>
      <MarkdownEditor aria-label="message" rows={3} autoResizeMaxRows={10} />
      <Button color="accent">Submit</Button>
    </Chat>
  ),
};
