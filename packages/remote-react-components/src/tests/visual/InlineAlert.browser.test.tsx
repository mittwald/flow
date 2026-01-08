import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";

const states = ["info", "success", "warning", "danger", "unavailable"] as const;

test.each(testEnvironments)(
  "InlineAlert states (%s)",
  async ({ testScreenshot, render, components: { InlineAlert, Flex } }) => {
    await render(
      <Flex direction="column" gap="m">
        {states.map((status) => (
          <InlineAlert key={status} status={status}>
            {firstLetterToUppercase(status)}
          </InlineAlert>
        ))}
      </Flex>,
    );

    await testScreenshot("InlineAlert states");
  },
);

test.each(testEnvironments)(
  "InlineAlert edge cases (%s)",
  async ({ testScreenshot, render, components: { InlineAlert } }) => {
    await render(
      <InlineAlert>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
        quam quas vel voluptas, ullam aliquid fugit. Voluptate harum accusantium
        rerum ullam modi blanditiis vitae, laborum ea tempore, dolore voluptas.
      </InlineAlert>,
    );

    await testScreenshot("InlineAlert edge cases");
  },
);
