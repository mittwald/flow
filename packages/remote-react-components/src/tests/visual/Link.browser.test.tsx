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
  "Link colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { Link, Flex, Wrap, AccentBox },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        {colors.map((color) => (
          <Wrap if={isAlphaColor(color)} key={color}>
            <AccentBox backgroundColor={alphaColorAccentBoxBackground(color)}>
              <Flex gap="s">
                <Link color={color}>{firstLetterToUppercase(color)}</Link>
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
                <Link size="s" color={color} target="_blank">
                  Small
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
  async ({
    testScreenshot,
    render,
    components: { Link, IconStar, AlertText, Text, Flex },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Link>
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies managed to
          steal secret plans to the Empire's ultimate weapon, the Death Star, an
          armored station with power to destroy an entire planet. <IconStar />
        </Link>
        <Text>
          <Link>
            <AlertText status="danger">Transmission failed</AlertText>
          </Link>
        </Text>
      </Flex>,
    );

    await testScreenshot("Link edge cases");
  },
);

test.each(testEnvironments)(
  "Link with Button (%s)",
  async ({ testScreenshot, render, components: { Link, Flex, Button } }) => {
    await render(
      <Flex gap="m" direction="column">
        <Link target="_blank">
          <Button>External Link</Button>
        </Link>
        <Link size="s" download>
          <Button>Small & Download</Button>
        </Link>
        <Link>
          <Button color="success">Button Color</Button>
        </Link>
        <Link color="dark">
          <Button>Link Color</Button>
        </Link>
        <Link isDisabled>
          <Button>Disabled</Button>
        </Link>
      </Flex>,
    );

    await testScreenshot("Link with Button");
  },
);
