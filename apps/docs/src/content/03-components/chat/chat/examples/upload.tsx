import {
  FileCard,
  FileCardList,
  Align,
  Avatar,
  Button,
  Chat,
  Content,
  Header,
  Initials,
  Message,
  MessageThread,
  Text,
  TextArea,
  IconAttachment,
} from "@mittwald/flow-react-components";

<Chat>
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
        <Text>
          Labore, similique. Earum, quas in. At dolorem
          corrupti blanditiis nulla deserunt laborum!
          Corrupti delectus aspernatur nihil nulla obcaecati
          ipsam porro sequi rem? Quam.
        </Text>
      </Content>
    </Message>
  </MessageThread>
  <Button
    color="secondary"
    variant="plain"
    aria-label="file attachment"
  >
    <IconAttachment />
  </Button>
  <TextArea
    aria-label="message"
    rows={1}
    autoResizeMaxRows={4}
  />
  <Button color="accent">Submit</Button>
  <FileCardList>
    <FileCard name="Uploaded File 1" />
    <FileCard name="Uploaded File 2" />
  </FileCardList>
</Chat>;
