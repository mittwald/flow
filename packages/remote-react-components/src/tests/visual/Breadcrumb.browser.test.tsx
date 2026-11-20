import { testEnvironments } from "@/tests/lib/environments";
import { alphaColorAccentBoxBackground } from "@/tests/lib/alphaColorAccentBoxBackground";
import { test } from "vitest";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";

const colors = ["default", ...alphaColors] as const;

test.each(testEnvironments)(
  "Breadcrumb (%s)",
  async ({
    testScreenshot,
    render,
    components: { Link, Flex, Wrap, Breadcrumb, AccentBox },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {colors.map((color) => (
          <Wrap if={isAlphaColor(color)} key={color}>
            <AccentBox backgroundColor={alphaColorAccentBoxBackground(color)}>
              <Breadcrumb color={color}>
                <Link>{firstLetterToUppercase(color)}</Link>
                <Link>Tatooine</Link>
                <Link>Mos Eisley</Link>
              </Breadcrumb>
            </AccentBox>
          </Wrap>
        ))}
        <Breadcrumb size="s">
          <Link>Small</Link>
          <Link>Tatooine</Link>
          <Link>Mos Eisley</Link>
        </Breadcrumb>
        <Breadcrumb>
          <Link>
            A long time ago in a galaxy far, far away the Rebel Alliance struck
            a decisive blow against the Galactic Empire fleet.
          </Link>
          <Link>
            A long time ago in a galaxy far, far away the Rebel Alliance struck
            a decisive blow against the Galactic Empire fleet.
          </Link>
          <Link>
            A long time ago in a galaxy far, far away the Rebel Alliance struck
            a decisive blow against the Galactic Empire fleet.
          </Link>
        </Breadcrumb>
      </Flex>,
    );

    await testScreenshot("Breadcrumb");
  },
);
