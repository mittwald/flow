import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import React from "react";

const headingLevels = [1, 2, 3, 4, 5, 6] as const;
const headingSizes = ["xs", "s", "m", "l", "xl", "xxl"] as const;
const headingColors = ["primary", "dark", "light"] as const;

test.each(testEnvironments)(
  "Heading sizes (%s)",
  async ({ container, render, components: { Heading, Flex, IconStar } }) => {
    await render(
      <Flex gap="m" direction="column">
        {headingLevels.map((level) => (
          <Heading level={level}>Level {level}</Heading>
        ))}
        {headingSizes.map((size) => (
          <Heading size={size}>
            <IconStar />
            Size {size}
          </Heading>
        ))}
      </Flex>,
    );

    await expect(container).toMatchScreenshot("Heading sizes");
  },
);

test.each(testEnvironments)(
  "Heading colors (%s)",
  async ({
    container,
    render,
    components: { Heading, Flex, IconStar, Badge, Wrap, AccentBox },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        {headingColors.map((color) => (
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

    await expect(container).toMatchScreenshot("Heading colors");
  },
);

test.each(testEnvironments)(
  "Heading edge cases (%s)",
  async ({
    container,
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

    await expect(container).toMatchScreenshot("Heading edge cases");
  },
);
