import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

test.each(testEnvironments)(
  "Skeleton (%s)",
  async ({ container, render, components: { Skeleton, Flex } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Skeleton />
        <Skeleton width="300px" height="100px" />
      </Flex>,
    );

    await expect(container).toMatchScreenshot("Skeleton");
  },
);
