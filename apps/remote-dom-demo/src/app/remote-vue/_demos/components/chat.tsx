/** @jsxImportSource @/app/remote-vue/_lib */
import { ComponentGroupPage } from "@/app/remote-vue/_demos/components/lib/ComponentGroupPage";
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
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h, ref } from "vue";

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
      {/* `h()`, because the JSX types of intrinsic elements take no children. */}
      <Text>
        {h("strong", props.name)}
        {props.role}
      </Text>
    </Combine>
  </Header>
);

/**
 * The Vue counterpart of `/remote/components/chat`. `Chat` composes
 * `MessageThread` and `Message`, so one example covers all three.
 */
export const ChatDemo = defineComponent({
  name: "ChatDemo",
  setup() {
    const draft = ref("");
    const sent = ref<string[]>([]);

    const send = () => {
      if (draft.value.trim()) {
        sent.value = [...sent.value, draft.value];
        draft.value = "";
      }
    };

    return () => (
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
                    The plans are in the droid. Get them to my father on
                    Alderaan.
                  </Text>
                </Content>
              </Message>
              {sent.value.map((text, index) => (
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
              value={draft.value}
              onChange={(value: string) => (draft.value = value)}
            />
            <Button color="success" onPress={send}>
              Send
            </Button>
          </Chat>
        </Section>
      </ComponentGroupPage>
    );
  },
});
