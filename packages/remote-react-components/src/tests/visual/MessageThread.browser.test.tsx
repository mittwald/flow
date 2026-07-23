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
            <Text>Luke Skywalker</Text>
          </Header>
          <Content>
            <Text>
              A long time ago in a galaxy far, far away, the Rebel Alliance
              struck a decisive blow against the Galactic Empire. Rebel spies
              managed to steal secret plans to the Empire's ultimate weapon, the
              Death Star.
            </Text>
          </Content>
        </Message>
        <MessageSeparator>MessageSeparator</MessageSeparator>

        <Message type="sender">
          <Header>
            <Text>Leia Organa</Text>
          </Header>
          <Content>
            <Text>
              The Rebel Alliance struck a decisive blow against the Galactic
              Empire.
            </Text>
          </Content>
        </Message>
        <Message>
          <Header>
            <Text>Luke Skywalker</Text>
          </Header>
          <Content>
            <Text>The Death Star plans were stolen by rebels.</Text>
          </Content>
        </Message>
      </MessageThread>,
    );

    await testScreenshot("MessageThread");
  },
);
