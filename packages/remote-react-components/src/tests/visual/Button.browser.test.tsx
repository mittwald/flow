import { testEnvironments } from "@/tests/lib/environments";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import { test } from "vitest";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";

const colors = [
  "primary",
  "accent",
  "danger",
  "secondary",
  ...alphaColors,
] as const;
const variants = ["solid", "outline", "soft", "plain"] as const;

test.each(testEnvironments)(
  "Button states (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Button, IconInfo, Text },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Flex gap="s">
          <Button>Default</Button>
          <Button>
            <IconInfo />
          </Button>
          <Button>
            <IconInfo />
            <Text>Icon & Text</Text>
          </Button>
        </Flex>
        <Flex gap="s">
          <Button size="s">Small</Button>
          <Button size="s">
            <IconInfo />
          </Button>
          <Button size="s">
            <IconInfo />
            <Text>Icon & Text</Text>
          </Button>
        </Flex>

        {variants.map((variant) => (
          <Flex gap="s" key={variant}>
            <Button variant={variant} isPending>
              {firstLetterToUppercase(variant)} Pending
            </Button>
            <Button variant={variant} isSucceeded>
              {firstLetterToUppercase(variant)} Succeeded
            </Button>
            <Button variant={variant} isFailed>
              {firstLetterToUppercase(variant)} Failed
            </Button>
            <Button variant={variant} isDisabled>
              {firstLetterToUppercase(variant)} Disabled
            </Button>
          </Flex>
        ))}
      </Flex>,
    );

    await testScreenshot("Button states");
  },
);

test.each(testEnvironments)(
  "Button colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Button, AccentBox, Wrap },
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
                {variants.map((variant) => (
                  <Button variant={variant} color={color} key={variant}>
                    {firstLetterToUppercase(color)}{" "}
                    {firstLetterToUppercase(variant)}
                  </Button>
                ))}
              </Flex>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("Button colors");
  },
);

const avatarSizes = ["xs", "s", "m", "l"] as const;

test.each(testEnvironments)(
  "Button with Avatar (%s)",
  async ({
    testScreenshot,
    render,
    components: { Avatar, Button, Initials, Flex },
  }) => {
    await render(
      <Flex gap="s">
        {avatarSizes.map((size) => (
          <Button>
            <Avatar size={size}>
              <Initials>Luke Skywalker</Initials>
            </Avatar>
          </Button>
        ))}
      </Flex>,
    );

    await testScreenshot("Button with avatar");
  },
);

test.each(testEnvironments)(
  "Button edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Button, Text, IconInfo },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Button>
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies managed to
          steal secret plans to the Empire's ultimate weapon, the Death Star, an
          armored space station with enough power to destroy an entire planet,
          and fled to the fourth moon of Yavin.
        </Button>
        <Button>
          <IconInfo />
          <Text>
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. Rebel spies managed to
            steal secret plans to the Empire's ultimate weapon, the Death Star,
            an armored space station with enough power to destroy an entire
            planet, and fled to the fourth moon of Yavin.
          </Text>
        </Button>
      </Flex>,
    );

    await testScreenshot("Button edge cases");
  },
);
