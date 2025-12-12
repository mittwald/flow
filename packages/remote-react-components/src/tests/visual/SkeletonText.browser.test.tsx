import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

test.each(testEnvironments)(
  "SkeletonText (%s)",
  async ({ container, render, components: { SkeletonText, Flex } }) => {
    await render(
      <Flex direction="column" gap="m">
        <SkeletonText />
        <SkeletonText width="300px" />
      </Flex>,
    );

    await expect(container).toMatchScreenshot("SkeletonText");
  },
);
