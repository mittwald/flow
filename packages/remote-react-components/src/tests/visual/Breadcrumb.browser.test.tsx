import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const colors = ["default", "dark", "light"] as const;

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
          <Wrap if={color === "light"} key={color}>
            <AccentBox>
              <Breadcrumb color={color}>
                <Link>Link 1</Link>
                <Link>Link 2</Link>
                <Link>Link 3</Link>
              </Breadcrumb>
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
