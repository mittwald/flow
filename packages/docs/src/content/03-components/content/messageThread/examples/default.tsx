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
        Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Cumque eius quam quas vel voluptas, ullam
        aliquid fugit. Voluptate harum accusantium rerum
        ullam modi blanditiis vitae.
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
        elit. Cumque eius quam quas vel voluptas, ullam
        aliquid fugit. Voluptate harum accusantium rerum
        ullam modi blanditiis vitae, laborum ea tempore,
        dolore voluptas. Earum pariatur, similique corrupti
        id officia perferendis. Labore, similique. Earum,
        quas in. At dolorem corrupti blanditiis nulla
        deserunt laborum! Corrupti delectus aspernatur nihil
        nulla obcaecati ipsam porro sequi rem? Quam.
      </Text>
    </Content>
  </Message>

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
      <Text>Lorem ipsum dolor sit amet.</Text>
    </Content>
  </Message>
</MessageThread>;
