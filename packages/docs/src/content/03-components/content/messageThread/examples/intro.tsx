import { Message } from "@mittwald/flow-react-components/Message";
import { Header } from "@mittwald/flow-react-components/Header";
import { Align } from "@mittwald/flow-react-components/Align";
import { Avatar } from "@mittwald/flow-react-components/Avatar";
import { Initials } from "@mittwald/flow-react-components/Initials";
import { Text } from "@mittwald/flow-react-components/Text";
import { Content } from "@mittwald/flow-react-components/Content";
import { MessageThread } from "@mittwald/flow-react-components/MessageThread";

<MessageThread>
  <Message type="sender">
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
          <b>John Doe</b>
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
