import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

test.each(testEnvironments)(
  "Initials (%s)",
  async ({ container, render, components: { Initials, Flex } }) => {
    await render(
      <Flex gap="s" align="center">
        <Initials>Max Mustermann</Initials>
        <Initials>Max </Initials>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("Initials");
  },
);
