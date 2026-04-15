import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";

const colors = ["default", ...alphaColors] as const;
const sizes = ["s", "m", "l"] as const;

test.each(testEnvironments)(
  "LoadingSpinner (%s)",
  async ({
    testScreenshot,
    render,
    components: { LoadingSpinner, Flex, Wrap, AccentBox },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        {colors.map((color) => (
          <Wrap if={isAlphaColor(color)} key={color}>
            <AccentBox
              backgroundColor={
                color.startsWith("light") ? "#3A434E" : "neutral"
              }
            >
              <Flex gap="s">
                {sizes.map((size) => (
                  <LoadingSpinner key={size} size={size} color={color} />
                ))}
              </Flex>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("LoadingSpinner");
  },
);
