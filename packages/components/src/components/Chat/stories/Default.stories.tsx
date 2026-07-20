import type { Meta, StoryObj } from "@storybook/react";
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
import { Field, Form, SubmitButton } from "@/integrations/react-hook-form";
import { action } from "storybook/actions";
import { useForm } from "react-hook-form";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { FileField } from "@/components/FileField";

const meta: Meta<typeof Chat> = {
  title: "Chat/Chat",
  component: Chat,
  parameters: {
    controls: { disable: true },
  },
  args: { height: 400 },
  render: (props) => (
    <Chat {...props}>
      <MessageThread>
        <Message>
          <Header>
            <Align>
              <Avatar>
                <Initials>Luke Skywalker</Initials>
              </Avatar>
              <Text>
                <strong>Luke Skywalker</strong>
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
                <Initials>Leia Organa</Initials>
              </Avatar>
              <Text>
                <strong>Leia Organa</strong>
              </Text>
            </Align>
          </Header>
          <Content>
            <Text>{dummyText.long}</Text>
          </Content>
        </Message>
      </MessageThread>
      <TextArea aria-label="message" rows={3} autoResizeMaxRows={10} />
      <Button color="accent">Send</Button>
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
                <Initials>Luke Skywalker</Initials>
              </Avatar>
              <Text>
                <strong>Luke Skywalker</strong>
              </Text>
            </Align>
          </Header>
          <Content>
            <Text>{dummyText.long}</Text>
          </Content>
        </Message>
      </MessageThread>
      <TextArea aria-label="message" rows={3} autoResizeMaxRows={10} />
      <FileField>
        <Button variant="outline" color="secondary">
          Attach file
        </Button>
      </FileField>
      <Button color="accent">Send</Button>
      <FileCardList>
        <FileCard name="death-star-plans.pdf" />
        <FileCard name="rebel-briefing.docx" />
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
                  <Initials>Luke Skywalker</Initials>
                </Avatar>
                <Text>
                  <strong>Luke Skywalker</strong>
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
          <SubmitButton>Send</SubmitButton>
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
                <Initials>Luke Skywalker</Initials>
              </Avatar>
              <Text>
                <strong>Luke Skywalker</strong>
              </Text>
            </Align>
          </Header>
          <Content>
            <Text>{dummyText.long}</Text>
          </Content>
        </Message>
      </MessageThread>
      <MarkdownEditor aria-label="message" rows={3} autoResizeMaxRows={10} />
      <Button color="accent">Send</Button>
    </Chat>
  ),
};
