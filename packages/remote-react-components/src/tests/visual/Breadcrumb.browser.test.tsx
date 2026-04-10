import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";

const colors = ["primary", ...alphaColors] as const;

test.each(testEnvironments)(
  "Breadcrumb colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { Link, Flex, Wrap, Breadcrumb, AccentBox },
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
              <Flex direction="column" gap="m">
                <Breadcrumb color={color}>
                  <Link>Link 1</Link>
                  <Link>Link 2</Link>
                  <Link>Link 3</Link>
                </Breadcrumb>
                <Breadcrumb color={color} size="s">
                  <Link>Link 1</Link>
                  <Link>Link 2</Link>
                  <Link>Link 3</Link>
                </Breadcrumb>
              </Flex>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("Breadcrumb colors");
  },
);

test.each(testEnvironments)(
  "Breadcrumb edge cases (%s)",
  async ({ testScreenshot, render, components: { Link, Breadcrumb } }) => {
    await render(
      <Breadcrumb>
        <Link>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit.
        </Link>
        <Link>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit.
        </Link>
        <Link>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit.
        </Link>
      </Breadcrumb>,
    );

    await testScreenshot("Breadcrumb edge cases");
  },
);
