import {
  Align,
  Avatar,
  Button,
  Chat,
  Content,
  Header,
  Initials,
  Message,
  MessageSeparator,
  MessageThread,
  Text,
  MarkdownEditor,
} from "@mittwald/flow-react-components";

<Chat height={400}>
  <MessageThread>
    <MessageSeparator>Ticket geöffnet</MessageSeparator>
    <Message>
      <Header>
        <Align>
          <Avatar>
            <Initials>Max Mustermann</Initials>
          </Avatar>
          <Text>
            <strong>Max Mustermann</strong>
          </Text>
        </Align>
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
        <Align>
          <Avatar>
            <Initials>John Doe</Initials>
          </Avatar>
          <Text>
            <strong>John Doe</strong>
          </Text>
        </Align>
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
  <MarkdownEditor aria-label="Nachricht" />
  <Button color="accent">Senden</Button>
</Chat>;
