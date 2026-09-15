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

/*
 * The non-modal popover is positioned by Flow, not by react-aria's `usePopover`
 * — different machinery, same picture. Tip, placement and entry animation come
 * from `useOverlayPosition` here, so the rendering is what has to be guarded.
 */
test.each(testEnvironments)(
  "ContextualHelp non-modal (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      ContextualHelpTrigger,
      ContextualHelp,
      Button,
      Heading,
      Text,
    },
  }) => {
    await render(
      <ContextualHelpTrigger>
        <Button data-testid="trigger" />
        <ContextualHelp modality="non-modal">
          <Heading>Heading</Heading>
          <Text>
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire.
          </Text>
        </ContextualHelp>
      </ContextualHelpTrigger>,
    );

    await page.getByTestId("trigger").click();

    await testScreenshot("ContextualHelp - non-modal");
  },
);
