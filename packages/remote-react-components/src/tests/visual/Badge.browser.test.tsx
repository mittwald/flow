import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";

export const colors = [
  "neutral",
  "blue",
  "navy",
  "violet",
  "teal",
  "lilac",
  "green",
  "orange",
  "red",
  ...alphaColors,
] as const;

test.each(testEnvironments)(
  "Badge colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { Badge, Flex, Label, Text, Wrap, AccentBox },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {colors.map((color) => (
          <Wrap if={isAlphaColor(color)} key={color}>
            <AccentBox
              backgroundColor={
                color.startsWith("light") ? "#3A434E" : "neutral"
              }
            >
              <Flex gap="s">
                <Badge color={color}>{firstLetterToUppercase(color)}</Badge>
                <Badge color={color} onClose={() => console.log("onClose")}>
                  Value
                </Badge>
                <Badge color={color} isDisabled>
                  Value
                </Badge>
                <Badge color={color}>
                  <Label>Scope</Label>
                  <Text>Value</Text>
                </Badge>
                <Badge color={color} onClose={() => console.log("onClose")}>
                  <Label>Scope</Label>
                  <Text>Value</Text>
                </Badge>
                <Badge isDisabled color={color}>
                  <Label>Scope</Label>
                  <Text>Value</Text>
                </Badge>
              </Flex>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("Badge colors");
  },
);

test.each(testEnvironments)(
  "Badge edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { Badge, Label, Text, Flex },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Badge>
          <Label>Scope</Label>
          <Text>
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. Rebel spies managed to
            steal secret plans to the Empire's ultimate weapon, the Death Star,
            an armored space station.
          </Text>
        </Badge>
        <Badge>
          <Label>
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. Rebel spies managed to
            steal secret plans to the Empire's ultimate weapon, the Death Star,
            an armored space station.
          </Label>
          <Text>Value</Text>
        </Badge>
        <Badge>
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies managed to
          steal secret plans to the Empire's ultimate weapon, the Death Star, an
          armored space station.
        </Badge>
      </Flex>,
    );

    await testScreenshot("Badge edge cases");
  },
);
