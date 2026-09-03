import { testEnvironments } from "@/tests/lib/environments";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import { statusTypes } from "@mittwald/flow-react-components/internal";
import { test } from "vitest";

test.each(testEnvironments)(
  "Alert states (%s)",
  async ({
    testScreenshot,
    render,
    components: { Alert, Flex, Heading, Content },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {statusTypes.map((status) => (
          <Alert status={status} key={status}>
            <Heading>{firstLetterToUppercase(status)}</Heading>
            <Content>Content</Content>
          </Alert>
        ))}
      </Flex>,
    );

    await testScreenshot("Alert states");
  },
);

test.each(testEnvironments)(
  "Alert content (%s)",
  async ({
    testScreenshot,
    render,
    components: { Alert, Heading, Text, Content, Link, Button, ActionGroup },
  }) => {
    await render(
      <Alert>
        <Heading>Heading</Heading>
        <Content>
          <Text>Text</Text>
          <Link>Link</Link>
          <Button>Button</Button>
          <ActionGroup>
            <Button color="secondary" variant="soft">
              Secondary
            </Button>
            <Button>Primary</Button>
          </ActionGroup>
        </Content>
      </Alert>,
    );

    await testScreenshot("Alert content");
  },
);

test.each(testEnvironments)(
  "Alert edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { Alert, Heading, Content },
  }) => {
    await render(
      <Alert>
        <Heading>
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies managed to
          steal secret plans to the Empire's ultimate weapon, the Death Star, an
          armored space station with enough power to destroy an entire planet.
        </Heading>
        <Content>Content</Content>
      </Alert>,
    );

    await testScreenshot("Alert edge cases");
  },
);
