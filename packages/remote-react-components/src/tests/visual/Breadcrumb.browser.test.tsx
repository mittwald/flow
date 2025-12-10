import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import React from "react";

const breadcrumbColors = ["primary", "dark", "light"] as const;

test.each(testEnvironments)(
  "Breadcrumb colors (%s)",
  async ({
    container,
    render,
    components: { Link, Flex, Wrap, Breadcrumb, AccentBox },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {breadcrumbColors.map((color) => (
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

    await expect(container).toMatchScreenshot("Breadcrumb colors");
  },
);

test.each(testEnvironments)(
  "Breadcrumb edge cases (%s)",
  async ({ container, render, components: { Link, Breadcrumb } }) => {
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

    await expect(container).toMatchScreenshot("Breadcrumb edge cases");
  },
);
