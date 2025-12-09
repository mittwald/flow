import { expect, test } from "vitest";
import { testEnvironments } from "@/tests/lib/environments";

type AccentBoxColor = "blue" | "green" | "gradient" | "neutral";

const accentBoxColors: AccentBoxColor[] = [
  "blue",
  "green",
  "gradient",
  "neutral",
];

test.each(testEnvironments)(
  "AccentBox colors (%s)",
  async ({
    container,
    render,
    components: { Flex, AccentBox, Section, Heading, Text, Link, IconStar },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {accentBoxColors.map((color) => (
          <AccentBox key={color} color={color}>
            <IconStar />
            <Section>
              <Heading>Heading</Heading>
              <Text>Text</Text>
              <Link>Link</Link>
            </Section>
          </AccentBox>
        ))}
      </Flex>,
    );

    await expect(container).toMatchScreenshot("AccentBox colors");
  },
);

test.each(testEnvironments)(
  "AccentBox in LayoutCard (%s)",
  async ({
    container,
    render,
    components: { AccentBox, Section, Heading, Text, Link, LayoutCard },
  }) => {
    await render(
      <LayoutCard>
        <AccentBox>
          <Section>
            <Heading>Heading</Heading>
            <Text>Text</Text>
            <Link>Link</Link>
          </Section>
        </AccentBox>
      </LayoutCard>,
    );

    await expect(container).toMatchScreenshot("AccentBox in LayoutCard");
  },
);
