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
                <Initials>Luke Skywalker</Initials>
              </Avatar>
              <Text>Luke Skywalker</Text>
            </Align>
            <Text>01.09.2025, 11:00</Text>
          </Header>

          <Content>
            <Flex direction="column" gap="m">
              <Text>
                A long time ago in a galaxy far, far away, the Rebel Alliance
                struck a decisive blow against the Galactic Empire. Rebel spies
                managed to steal secret plans to the Empire's ultimate weapon,
                the Death Star.
              </Text>
              <FileCardList>
                <FileCard name="death-star-plans.pdf" />
                <FileCard name="rebel-base-map.pdf" />
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
              A long time ago in a galaxy far, far away, the Rebel Alliance
              struck a decisive blow against the Galactic Empire. Rebel spies
              managed to steal secret plans to the Empire's ultimate weapon, the
              Death Star.
            </Text>
          </Content>

          <Button>Button</Button>
        </Message>
        <Message color="#ffeedd">
          <Content>
            <Text>Custom color</Text>
          </Content>
        </Message>
      </Flex>,
    );

    await testScreenshot("Message");
  },
);
