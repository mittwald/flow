import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "SkeletonText (%s)",
  async ({ testScreenshot, render, components: { SkeletonText, Flex } }) => {
    await render(
      <Flex direction="column" gap="m">
        <SkeletonText />
        <SkeletonText width="300px" />
      </Flex>,
    );

    await testScreenshot("SkeletonText");
  },
);
