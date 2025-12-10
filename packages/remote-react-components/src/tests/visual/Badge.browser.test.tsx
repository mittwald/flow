import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import React from "react";
import { userEvent } from "vitest/browser";

export const badgeColors = [
  "neutral",
  "blue",
  "navy",
  "violet",
  "teal",
  "lilac",
  "green",
  "orange",
  "red",
  "dark",
  "light",
] as const;

test.each(testEnvironments)(
  "Badge colors (%s)",
  async ({
    container,
    render,
    components: { Badge, Flex, Label, Text, Wrap, AccentBox },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {badgeColors.map((color) => (
          <Wrap if={color === "light"} key={color}>
            <AccentBox>
              <Flex gap="s">
                <Badge color={color}>Value</Badge>
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

    await expect(container).toMatchScreenshot("Badge colors");
  },
);

test.each(testEnvironments)(
  "Badge with onPress (%s)",
  async ({ container, render, components: { Badge, Label, Text } }) => {
    await render(
      <Badge onPress={() => console.log("onPress")}>
        <Label>Scope</Label>
        <Text>Value</Text>
      </Badge>,
    );

    await userEvent.tab();

    await expect(container).toMatchScreenshot("Badge with onPress");
  },
);

test.each(testEnvironments)(
  "Badge with onClose (%s)",
  async ({ container, render, components: { Badge, Label, Text } }) => {
    await render(
      <Badge onClose={() => console.log("onClose")}>
        <Label>Scope</Label>
        <Text>Value</Text>
      </Badge>,
    );

    await userEvent.tab();

    await expect(container).toMatchScreenshot("Badge with onClose");
  },
);

test.each(testEnvironments)(
  "Badge edge cases (%s)",
  async ({ container, render, components: { Badge, Label, Text, Flex } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Badge>
          <Label>Scope</Label>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
            accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
            dolore voluptas.
          </Text>
        </Badge>
        <Badge>
          <Label>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
            quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
            accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
            dolore voluptas.
          </Label>
          <Text>Value</Text>
        </Badge>
        <Badge>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas.
        </Badge>
      </Flex>,
    );

    await userEvent.tab();

    await expect(container).toMatchScreenshot("Badge edge cases");
  },
);
