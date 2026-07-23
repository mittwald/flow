import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";

const levels = [1, 2, 3, 4, 5, 6] as const;
const sizes = ["xs", "s", "m", "l", "xl", "xxl"] as const;
const colors = ["default", "danger", "unavailable", ...alphaColors] as const;

test.each(testEnvironments)(
  "Heading sizes (%s)",
  async ({
    testScreenshot,
    render,
    components: { Heading, Flex, IconStar },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        {levels.map((level) => (
          <Heading level={level} key={level}>
            Level {level}
          </Heading>
        ))}
        {sizes.map((size) => (
          <Heading size={size} key={size}>
            <IconStar />
            Size {size}
          </Heading>
        ))}
      </Flex>,
    );

    await testScreenshot("Heading sizes");
  },
);

test.each(testEnvironments)(
  "Heading colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { Heading, Flex, IconStar, Badge, Wrap, AccentBox },
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
              <Heading color={color}>
                <IconStar />
                {firstLetterToUppercase(color)}
                <Badge>Badge</Badge>
              </Heading>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("Heading colors");
  },
);

test.each(testEnvironments)(
  "Heading edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Heading,
      Flex,
      IconStar,
      Badge,
      AlertBadge,
      ContextualHelp,
      ContextualHelpTrigger,
      Button,
    },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        <Heading wrap="balance">
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies managed to
          steal secret plans to the Empire's ultimate weapon, the Death Star, an
          armored station with power to destroy an entire planet. Pursued by
          sinister agents, Leia races home.
        </Heading>
        <Heading>
          <IconStar />A long time ago in a galaxy far, far away, the Rebel
          Alliance struck a decisive blow against the Galactic Empire. Rebel
          spies managed to steal secret plans to the Empire's ultimate weapon,
          the Death Star, an armored station with power to destroy an entire
          planet. Pursued by sinister agents, Leia races home.
          <ContextualHelpTrigger>
            <Button />
            <ContextualHelp />
          </ContextualHelpTrigger>
          <Badge>Badge</Badge>
          <AlertBadge>Badge</AlertBadge>
        </Heading>
      </Flex>,
    );

    await testScreenshot("Heading edge cases");
  },
);
