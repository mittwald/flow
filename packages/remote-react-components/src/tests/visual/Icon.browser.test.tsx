import { testEnvironments } from "@/tests/lib/environments";
import { alphaColorAccentBoxBackground } from "@/tests/lib/alphaColorAccentBoxBackground";
import { test } from "vitest";
import {
  alphaColors,
  statusTypes,
} from "@mittwald/flow-react-components/internal";

const sizes = ["s", "m", "l"] as const;

const colors = [
  "neutral",
  "blue",
  "violet",
  "teal",
  "lilac",
  ...statusTypes,
] as const;

test.each(testEnvironments)(
  "Icon (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, IconStar, Icon, AccentBox },
  }) => {
    await render(
      <Flex gap="m" direction="column" align="start">
        <Flex gap="s" align="center">
          {sizes.map((size) => (
            <IconStar size={size} key={size} />
          ))}
        </Flex>
        <Flex gap="s" align="center">
          {colors.map((color) => (
            <IconStar color={color} key={color} />
          ))}
          <IconStar color="#0fdf00" />
        </Flex>
        <Flex gap="s" direction="column">
          {alphaColors.map((color) => (
            <AccentBox
              key={color}
              backgroundColor={alphaColorAccentBoxBackground(color)}
            >
              {/* AccentBox hides direct icon children, so nest it */}
              <Flex>
                <IconStar color={color} />
              </Flex>
            </AccentBox>
          ))}
        </Flex>
        <Icon>
          <svg
            fill="currentColor"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
        </Icon>
      </Flex>,
    );

    await testScreenshot("Icon");
  },
);
