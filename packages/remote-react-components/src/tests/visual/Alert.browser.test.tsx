import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

type AlertStatus = "info" | "success" | "warning" | "danger";

const alertStates: AlertStatus[] = ["info", "success", "warning", "danger"];

const firstLetterToUppercase = (text: string) => {
  return text[0]!.toUpperCase() + text.slice(1).toLowerCase();
};

test.each(testEnvironments)(
  "Alert states (%s)",
  async ({
    container,
    render,
    components: { Alert, Flex, Heading, Content },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {alertStates.map((status) => (
          <Alert status={status}>
            <Heading>{firstLetterToUppercase(status)}</Heading>
            <Content>Content</Content>
          </Alert>
        ))}
      </Flex>,
    );

    await expect(container).toMatchScreenshot("Alert states");
  },
);

test.each(testEnvironments)(
  "Alert content (%s)",
  async ({
    container,
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

    await expect(container).toMatchScreenshot("Alert content");
  },
);

test.each(testEnvironments)(
  "Alert edge cases (%s)",
  async ({ container, render, components: { Alert, Heading, Content } }) => {
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

    await expect(container).toMatchScreenshot("Alert edge cases");
  },
);
