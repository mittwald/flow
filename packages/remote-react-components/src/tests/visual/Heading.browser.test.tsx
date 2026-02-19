import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";

const levels = [1, 2, 3, 4, 5, 6] as const;
const sizes = ["xs", "s", "m", "l", "xl", "xxl"] as const;
const colors = ["default", "dark", "light", "danger", "unavailable"] as const;

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
          <Wrap if={color === "light"} key={color}>
            <AccentBox>
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique corrupti id officia
          perferendis. Labore, similique.
        </Heading>
        <Heading>
          <IconStar />
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. Earum pariatur, similique corrupti id officia
          perferendis. Labore, similique.
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
