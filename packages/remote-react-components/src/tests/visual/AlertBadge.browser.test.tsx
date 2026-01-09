import { testEnvironments } from "@/tests/lib/environments";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";

import { test } from "vitest";

const states = ["info", "success", "warning", "danger"] as const;

test.each(testEnvironments)(
  "AlertBadge states (%s)",
  async ({ testScreenshot, render, components: { AlertBadge, Flex } }) => {
    await render(
      <Flex gap="s">
        {states.map((status) => (
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
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
        quam quas vel voluptas, ullam aliquid fugit. Voluptate harum accusantium
        rerum ullam modi blanditiis vitae, laborum ea tempore, dolore voluptas.
      </AlertBadge>,
    );

    await testScreenshot("AlertBadge edge cases");
  },
);
