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

/*
 * Regression test for #3160: MessageThread's `> li { list-style: none }`
 * (added for #2590's screen reader fix) used to be an unscoped `li`
 * selector, which also stripped markers from lists nested inside a
 * message's content instead of only the message wrapper itself.
 */
test.each(testEnvironments)(
  "MessageThread with lists (%s)",
  async ({
    testScreenshot,
    render,
    components: { Message, Content, Markdown, MessageThread },
  }) => {
    await render(
      <MessageThread>
        <Message>
          <Content>
            <Markdown>
              {"- Unordered list item 1\n" +
                "- Unordered list item 2\n\n" +
                "1. Ordered list item 1\n" +
                "2. Ordered list item 2"}
            </Markdown>
          </Content>
        </Message>
      </MessageThread>,
    );

    await testScreenshot("MessageThread with lists");
  },
);
