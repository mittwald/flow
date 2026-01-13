import { test } from "vitest";
import { testEnvironments } from "@/tests/lib/environments";

const colors = ["blue", "green", "gradient", "neutral"] as const;

test.each(testEnvironments)(
  "AccentBox colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, AccentBox, Section, Heading, Text, Link, IconStar },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {colors.map((color) => (
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

    await testScreenshot("AccentBox colors");
  },
);

test.each(testEnvironments)(
  "AccentBox in LayoutCard (%s)",
  async ({
    testScreenshot,
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

    await testScreenshot("AccentBox in LayoutCard");
  },
);
