import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Skeleton (%s)",
  async ({ testScreenshot, render, components: { Skeleton, Flex } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Skeleton />
        <Skeleton width="300px" height="100px" />
      </Flex>,
    );

    await testScreenshot("Skeleton");
  },
);
