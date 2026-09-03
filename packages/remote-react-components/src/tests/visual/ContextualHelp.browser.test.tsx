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
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. Rebel spies managed to
            steal secret plans to the Empire's ultimate weapon, the Death Star,
            an armored space station.
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
