import { testEnvironments } from "@/tests/lib/environments";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import { statusTypes } from "@mittwald/flow-react-components/internal";
import { test } from "vitest";

test.each(testEnvironments)(
  "AlertBadge states (%s)",
  async ({ testScreenshot, render, components: { AlertBadge, Flex } }) => {
    await render(
      <Flex gap="s">
        {statusTypes.map((status) => (
          <AlertBadge key={status} status={status}>
            {firstLetterToUppercase(status)}
          </AlertBadge>
        ))}
      </Flex>,
    );

    await testScreenshot("AlertBadge states");
  },
);

test.each(testEnvironments)(
  "AlertBadge edge cases (%s)",
  async ({ testScreenshot, render, components: { AlertBadge } }) => {
    await render(
      <AlertBadge>
        A long time ago in a galaxy far, far away, the Rebel Alliance struck a
        decisive blow against the Galactic Empire. Rebel spies managed to steal
        secret plans to the Empire's ultimate weapon, the Death Star.
      </AlertBadge>,
    );

    await testScreenshot("AlertBadge edge cases");
  },
);
