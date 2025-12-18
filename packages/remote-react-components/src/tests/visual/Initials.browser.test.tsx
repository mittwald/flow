import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Initials (%s)",
  async ({ testScreenshot, render, components: { Initials, Flex } }) => {
    await render(
      <Flex gap="s" align="center">
        <Initials>Max Mustermann</Initials>
        <Initials>Max </Initials>
      </Flex>,
    );

    await testScreenshot("Initials");
  },
);
