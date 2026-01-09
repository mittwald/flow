import {
  Align,
  Avatar,
  Content,
  Header,
  Initials,
  Message,
  MessageThread,
  Text,
} from "@mittwald/flow-react-components";

<MessageThread>
  <Message type="sender">
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
        Lorem ipsum dolor sit amet consectetur adipisicing.
      </Text>
    </Content>
  </Message>

  <Message type="responder">
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
        elit. Cumque eius quam.
      </Text>
    </Content>
  </Message>
</MessageThread>;
