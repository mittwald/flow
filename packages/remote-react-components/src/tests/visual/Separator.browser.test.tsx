import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Separator (%s)",
  async ({ testScreenshot, render, components: { Separator, Flex, Text } }) => {
    await render(
      <Flex direction="column" gap="xl">
        <Flex gap="m" direction="column">
          <Text align="center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Cumque eius quam quas vel
            voluptas, ullam aliquid fugit.
          </Text>
          <Separator />
          <Text align="center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Cumque eius quam quas vel
            voluptas, ullam aliquid fugit.
          </Text>
        </Flex>
        <Flex gap="m">
          <Text align="center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Cumque eius quam quas vel
            voluptas, ullam aliquid fugit.
          </Text>
          <Separator orientation="vertical" />
          <Text align="center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Cumque eius quam quas vel
            voluptas, ullam aliquid fugit.
          </Text>
        </Flex>
      </Flex>,
    );

    await testScreenshot("Separator");
  },
);
