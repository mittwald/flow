import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const colors = [
  "blue",
  "violet",
  "teal",
  "lilac",
  "danger",
  "warning",
  "info",
  "success",
] as const;

test.each(testEnvironments)(
  "Color (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Heading, Text, IconStar, Color },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {colors.map((color) => (
          <Flex gap="s" key={color}>
            <Text>
              <Color color={color}>Text</Color>
            </Text>
            <Heading>
              <Color color={color}>Heading</Color>
            </Heading>

            <Color color={color}>
              <IconStar />
            </Color>
          </Flex>
        ))}
      </Flex>,
    );

    await testScreenshot("Color");
  },
);
