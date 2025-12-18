import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "ContextualHelp (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      ContextualHelpTrigger,
      ContextualHelp,
      Button,
      Heading,
      Text,
      Link,
    },
  }) => {
    await render(
      <ContextualHelpTrigger>
        <Button data-testid="trigger" />
        <ContextualHelp>
          <Heading>Heading</Heading>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
            accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
            dolore voluptas.
          </Text>
          <Link>Link</Link>
        </ContextualHelp>
      </ContextualHelpTrigger>,
    );

    const trigger = page.getByTestId("trigger");

    await trigger.click();

    await testScreenshot("ContextualHelp - opened");
  },
);
