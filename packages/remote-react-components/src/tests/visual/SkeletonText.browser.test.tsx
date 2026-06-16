import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "SkeletonText (%s)",
  async ({
    testScreenshot,
    render,
    components: { SkeletonText, Flex, Text, Heading },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <SkeletonText />
        <SkeletonText width="300px" />
        <Text>
          <SkeletonText />
        </Text>
        <Heading>
          <SkeletonText />
        </Heading>
        <Heading level={1}>
          <SkeletonText />
        </Heading>
      </Flex>,
    );

    await testScreenshot("SkeletonText");
  },
);
