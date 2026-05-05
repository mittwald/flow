import { testEnvironments } from "@/tests/lib/environments";
import {
  alphaColors,
  isAlphaColor,
  statusTypes,
} from "@mittwald/flow-react-components/internal";
import { test } from "vitest";

const colors = [
  "blue",
  "violet",
  "teal",
  "lilac",
  ...statusTypes,
  ...alphaColors,
] as const;

test.each(testEnvironments)(
  "Color (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Heading, Text, IconStar, Color, Wrap, AccentBox },
  }) => {
    await render(
      <Flex direction="column" gap="s">
        {colors.map((color) => (
          <Wrap if={isAlphaColor(color)} key={color}>
            <AccentBox
              backgroundColor={
                color.startsWith("light") ? "#3A434E" : "neutral"
              }
            >
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
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("Color");
  },
);
