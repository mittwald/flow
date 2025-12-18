import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const colors = ["primary", "dark", "light"] as const;

test.each(testEnvironments)(
  "Link colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { Link, Flex, Wrap, AccentBox },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        {colors.map((color) => (
          <Wrap if={color === "light"} key={color}>
            <AccentBox>
              <Flex gap="s">
                <Link color={color}>Default</Link>
                <Link color={color} inline>
                  Inline
                </Link>
                <Link color={color} isDisabled>
                  Disabled
                </Link>
                <Link color={color} target="_blank">
                  External
                </Link>
                <Link color={color} target="_blank" download>
                  Download
                </Link>
              </Flex>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("Link colors");
  },
);

test.each(testEnvironments)(
  "Link edge cases (%s)",
  async ({ testScreenshot, render, components: { Link, IconStar } }) => {
    await render(
      <Link>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
        quam quas vel voluptas, ullam aliquid fugit. Voluptate harum accusantium
        rerum ullam modi blanditiis vitae, laborum ea tempore, dolore voluptas.{" "}
        <IconStar />
      </Link>,
    );

    await testScreenshot("Link edge cases");
  },
);
