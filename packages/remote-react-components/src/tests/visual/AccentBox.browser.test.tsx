import { test } from "vitest";
import { testEnvironments } from "@/tests/lib/environments";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import gopher from "@/tests/assets/gopher.webp";

const backgroundColors = [
  "neutral",
  "blue",
  "violet",
  "teal",
  "lilac",
  "green",
  "navy",
  "gradient",
] as const;

test.each(testEnvironments)(
  "AccentBox colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, AccentBox, Heading },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {backgroundColors.map((backgroundColor) => (
          <AccentBox key={backgroundColor} backgroundColor={backgroundColor}>
            <Heading>{firstLetterToUppercase(backgroundColor)}</Heading>
          </AccentBox>
        ))}
      </Flex>,
    );

    await testScreenshot("AccentBox colors");
  },
);

test.each(testEnvironments)(
  "AccentBox custom color (%s)",
  async ({
    testScreenshot,
    render,
    components: { AccentBox, Section, Heading, Text, Link },
  }) => {
    await render(
      <AccentBox backgroundColor="#a5e86b" color="dark-static">
        <Section>
          <Heading>Heading</Heading>
          <Text>Text</Text>
          <Link>Link</Link>
        </Section>
      </AccentBox>,
    );

    await testScreenshot("AccentBox custom color");
  },
);

test.each(testEnvironments)(
  "AccentBox background image (%s)",
  async ({
    testScreenshot,
    render,
    components: { AccentBox, Section, Heading, Text, Link, ColumnLayout },
  }) => {
    await render(
      <ColumnLayout>
        <AccentBox
          backgroundImage={gopher}
          color="light-static"
          aspectRatio={1}
        >
          <Section>
            <Heading>Heading</Heading>
            <Text>Text</Text>
            <Link>Link</Link>
          </Section>
        </AccentBox>
      </ColumnLayout>,
    );

    await testScreenshot("AccentBox background image");
  },
);

test.each(testEnvironments)(
  "AccentBox edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { AccentBox, Section, Heading, Text, Link, LayoutCard, Flex },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <LayoutCard>
          <AccentBox>
            <Section>
              <Heading>In LayoutCard</Heading>
              <Text>Text</Text>
              <Link>Link</Link>
            </Section>
          </AccentBox>
        </LayoutCard>
        <Link>
          <AccentBox>
            <Section>
              <Heading>With Link</Heading>
              <Text>Text</Text>
              <Link>Link</Link>
            </Section>
          </AccentBox>
        </Link>
        <Link target="_blank">
          <LayoutCard>
            <AccentBox>
              <Section>
                <Heading>With Link in LayoutCard</Heading>
                <Text>Text</Text>
                <Link>Link</Link>
              </Section>
            </AccentBox>
          </LayoutCard>
        </Link>
      </Flex>,
    );

    await testScreenshot("AccentBox edge cases");
  },
);
