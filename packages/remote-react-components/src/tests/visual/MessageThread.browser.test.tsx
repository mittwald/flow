import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "MessageThread (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Message,
      Header,
      Content,
      Text,
      MessageSeparator,
      MessageThread,
    },
  }) => {
    await render(
      <MessageThread>
        <Message>
          <Header>
            <Text>Max Mustermann</Text>
          </Header>
          <Content>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
              eius quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
              accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
              dolore voluptas.
            </Text>
          </Content>
        </Message>
        <MessageSeparator>MessageSeparator</MessageSeparator>

        <Message type="sender">
          <Header>
            <Text>John Doe</Text>
          </Header>
          <Content>
            <Text>
              Lorem ipsum dolor sit amet consectetur, laborum ea tempore, dolore
              voluptas.
            </Text>
          </Content>
        </Message>
        <Message>
          <Header>
            <Text>Max Mustermann</Text>
          </Header>
          <Content>
            <Text>Lorem ipsum dolor sit amet consectetur.</Text>
          </Content>
        </Message>
      </MessageThread>,
    );

    await testScreenshot("MessageThread");
  },
);
