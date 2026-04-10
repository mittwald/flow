import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";

const colors = ["primary", ...alphaColors] as const;

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
            <AccentBox
              backgroundColor={
                color.startsWith("light") ? "#3A434E" : "neutral"
              }
            >
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
          quam quas vel voluptas, ullam aliquid fugit. Voluptate harum
          accusantium rerum ullam modi blanditiis vitae, laborum ea tempore,
          dolore voluptas. <IconStar />
        </Link>
        <Text>
          <Link>
            <AlertText status="danger">Loading failed</AlertText>
          </Link>
        </Text>
      </Flex>,
    );

    await testScreenshot("Link edge cases");
  },
);
