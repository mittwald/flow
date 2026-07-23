import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";

const colors = ["default", ...alphaColors] as const;

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
                  <Link>{firstLetterToUppercase(color)}</Link>
                  <Link>Tatooine</Link>
                  <Link>Mos Eisley</Link>
                </Breadcrumb>
                <Breadcrumb color={color} size="s">
                  <Link>Small</Link>
                  <Link>Tatooine</Link>
                  <Link>Mos Eisley</Link>
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
          A long time ago in a galaxy far, far away the Rebel Alliance struck a
          decisive blow against the Galactic Empire fleet.
        </Link>
        <Link>
          A long time ago in a galaxy far, far away the Rebel Alliance struck a
          decisive blow against the Galactic Empire fleet.
        </Link>
        <Link>
          A long time ago in a galaxy far, far away the Rebel Alliance struck a
          decisive blow against the Galactic Empire fleet.
        </Link>
      </Breadcrumb>,
    );

    await testScreenshot("Breadcrumb edge cases");
  },
);
