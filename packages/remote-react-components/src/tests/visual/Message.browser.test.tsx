import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Message (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      Message,
      Header,
      Button,
      ContextMenuTrigger,
      ContextMenu,
      Align,
      Avatar,
      Initials,
      Content,
      Text,
      FileCard,
      FileCardList,
      ActionGroup,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Message>
          <Header>
            <ContextMenuTrigger>
              <Button />
              <ContextMenu />
            </ContextMenuTrigger>
            <Align>
              <Avatar>
                <Initials>Max Mustermann</Initials>
              </Avatar>
              <Text>Max Mustermann</Text>
            </Align>
            <Text>01.09.2025, 11:00</Text>
          </Header>

          <Content>
            <Flex direction="column" gap="m">
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
                eius quam quas vel voluptas, ullam aliquid fugit. Voluptate
                harum accusantium rerum ullam modi blanditiis vitae, laborum ea
                tempore, dolore voluptas.
              </Text>
              <FileCardList>
                <FileCard name="File 1" />
                <FileCard name="File 2" />
              </FileCardList>
            </Flex>
          </Content>
          <ActionGroup>
            <Button variant="soft" color="secondary">
              Secondary
            </Button>
            <Button>Primary</Button>
          </ActionGroup>
        </Message>
        <Message type="sender">
          <Content>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque
              eius quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
              accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
              dolore voluptas.
            </Text>
          </Content>

          <Button>Button</Button>
        </Message>
      </Flex>,
    );

    await testScreenshot("Message");
  },
);
