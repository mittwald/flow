import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Chat (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Chat,
      MessageThread,
      Message,
      Header,
      Text,
      Content,
      TextArea,
      FileField,
      Button,
      FileCardList,
      FileCard,
    },
  }) => {
    await render(
      <Chat>
        <MessageThread>
          <Message>
            <Header>
              <Text>Max Mustermann</Text>
            </Header>
            <Content>
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
                eius quam quas vel voluptas, ullam aliquid fugit. Voluptate
                harum accusantium rerum ullam modi blanditiis vitae, laborum ea
                tempore, dolore voluptas.
              </Text>
            </Content>
          </Message>
          <Message type="sender">
            <Header>
              <Text>John Doe</Text>
            </Header>
            <Content>
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
                eius quam quas vel voluptas, ullam aliquid fugit. Voluptate
                harum accusantium rerum ullam modi blanditiis vitae, laborum ea
                tempore, dolore voluptas.
              </Text>
            </Content>
          </Message>
        </MessageThread>
        <TextArea aria-label="message" />
        <FileField>
          <Button variant="outline" color="secondary">
            Attach file
          </Button>
        </FileField>
        <Button color="accent">Submit</Button>
        <FileCardList>
          <FileCard name="File 1" />
          <FileCard name="File 2" />
        </FileCardList>
      </Chat>,
    );

    await testScreenshot("Chat");
  },
);
