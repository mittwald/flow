import {
  Combine,
  Avatar,
  Button,
  Chat,
  Content,
  Header,
  Initials,
  MarkdownEditor,
  Message,
  MessageSeparator,
  MessageThread,
  Text,
} from "@mittwald/flow-react-components";

<Chat height={400}>
  <MessageThread>
    <MessageSeparator>Ticket geöffnet</MessageSeparator>
    <Message>
      <Header>
        <Combine>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
          <Text>
            <strong>Max Mustermann</strong>
          </Text>
        </Combine>
      </Header>
      <Content>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Cumque eius quam quas vel voluptas, ullam
          aliquid fugit. Voluptate harum accusantium rerum
          ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique
          corrupti id officia perferendis. Labore,
          similique. Earum, quas in. At dolorem corrupti
          blanditiis nulla deserunt laborum! Corrupti
          delectus aspernatur nihil nulla obcaecati ipsam
          porro sequi rem? Quam.
        </Text>
      </Content>
    </Message>
    <Message type="sender">
      <Header>
        <Combine>
          <Avatar>
            <Initials>John Doe</Initials>
          </Avatar>
          <Text>
            <strong>John Doe</strong>
          </Text>
        </Combine>
      </Header>
      <Content>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Cumque eius quam quas vel voluptas, ullam
          aliquid fugit. Voluptate harum accusantium rerum
          ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique
          corrupti id officia perferendis. Labore,
          similique. Earum, quas in.
        </Text>
      </Content>
    </Message>
  </MessageThread>
  <MarkdownEditor
    aria-label="Nachricht"
    rows={3}
    autoResizeMaxRows={10}
  />
  <Button color="success">Senden</Button>
</Chat>;
