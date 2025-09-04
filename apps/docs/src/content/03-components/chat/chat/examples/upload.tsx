import {
  Align,
  Avatar,
  Button,
  Chat,
  Content,
  FileCard,
  FileCardList,
  FileField,
  Header,
  Initials,
  Message,
  MessageThread,
  Text,
  TextArea,
} from "@mittwald/flow-react-components";
import React from "react";

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

  <FileField>
    <Button variant="outline" color="secondary">
      Datei anhängen
    </Button>
  </FileField>
  <Button color="accent">Senden</Button>
  <FileCardList>
    <FileCard name="Hochgeladene Datei 1" />
    <FileCard name="Hochgeladene Datei 2" />
  </FileCardList>
</Chat>;
