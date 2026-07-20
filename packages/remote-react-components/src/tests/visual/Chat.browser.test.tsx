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
              <Text>Luke Skywalker</Text>
            </Header>
            <Content>
              <Text>
                A long time ago in a galaxy far, far away, the Rebel Alliance
                struck a decisive blow against the Galactic Empire. Rebel spies
                managed to steal secret plans to the Empire's ultimate weapon,
                the Death Star, an armored space station.
              </Text>
            </Content>
          </Message>
          <Message type="sender">
            <Header>
              <Text>Han Solo</Text>
            </Header>
            <Content>
              <Text>
                A bold smuggler and his loyal Wookiee co-pilot ran the Kessel
                Run in record time, dodging Imperial patrols aboard the fastest
                ship in the galaxy, the Millennium Falcon, bound for a distant
                rebel outpost on Yavin.
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
          <FileCard name="death-star-plans.pdf" />
          <FileCard name="rebel-fleet.pdf" />
        </FileCardList>
      </Chat>,
    );

    await testScreenshot("Chat");
  },
);
