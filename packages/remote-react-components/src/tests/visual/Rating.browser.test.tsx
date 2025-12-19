import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Rating (%s)",
  async ({ testScreenshot, render, components: { Flex, Rating } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Rating />
        <Rating value={3} />
        <Rating value={5} size="s" />
      </Flex>,
    );

    await testScreenshot("Rating");
  },
);
