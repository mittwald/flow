import { testEnvironments } from "@/tests/lib/environments";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import { test } from "vitest";

const states = ["info", "success", "warning", "danger"] as const;

test.each(testEnvironments)(
  "Alert states (%s)",
  async ({
    testScreenshot,
    render,
    components: { Alert, Flex, Heading, Content },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {states.map((status) => (
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas.
        </Heading>
        <Content>Content</Content>
      </Alert>,
    );

    await testScreenshot("Alert edge cases");
  },
);
