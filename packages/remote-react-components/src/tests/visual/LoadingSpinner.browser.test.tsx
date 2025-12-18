import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const colors = ["default", "dark", "light"] as const;
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
          <Wrap if={color === "light"} key={color}>
            <AccentBox>
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
