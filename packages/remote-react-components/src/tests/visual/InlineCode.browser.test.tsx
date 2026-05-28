import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";

const colors = ["default", ...alphaColors] as const;

test.each(testEnvironments)(
  "InlineCode colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { InlineCode, Flex, Wrap, AccentBox },
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
              <InlineCode color={color}>
                {firstLetterToUppercase(color)}
              </InlineCode>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("InlineCode colors");
  },
);

test.each(testEnvironments)(
  "InlineCode edge cases (%s)",
  async ({ testScreenshot, render, components: { Text, InlineCode } }) => {
    await render(
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
        quam quas vel voluptas, ullam aliquid fugit.
        <InlineCode>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit.
        </InlineCode>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
        quam quas vel voluptas, ullam aliquid fugit.
        <InlineCode>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit.
        </InlineCode>
      </Text>,
    );

    await testScreenshot("InlineCode edge cases");
  },
);
