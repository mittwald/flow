import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const combineSince = "0.2.0-alpha.1050";

test.skipIf(crossVersion({ below: combineSince })).each(testEnvironments)(
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
      Combine,
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
            <Combine>
              <Avatar>
                <Initials>Luke Skywalker</Initials>
              </Avatar>
              <Text>Luke Skywalker</Text>
            </Combine>
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
            {/* A custom color does not adapt to the theme, so neither can the
                content color. */}
            <Text color="dark-static">Custom color</Text>
          </Content>
        </Message>
      </Flex>,
    );

    await testScreenshot("Message");
  },
);
