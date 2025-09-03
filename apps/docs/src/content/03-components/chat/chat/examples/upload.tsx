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

  <TextArea
    aria-label="Nachricht"
    rows={3}
    autoResizeMaxRows={10}
  />
  <Button color="secondary" variant="outline">
    Datei anhängen
  </Button>
  <Button color="accent">Senden</Button>
  <FileCardList>
    <FileCard name="Hochgeladene Datei 1" />
    <FileCard name="Hochgeladene Datei 2" />
  </FileCardList>
</Chat>;
