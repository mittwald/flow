import { test } from "vitest";
import { testEnvironments } from "@/tests/lib/environments";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import gopher from "@/tests/assets/gopher.webp";

const backgroundColors = [
  "neutral",
  "blue",
  "navy",
  "lilac",
  "sage",
  "salmon",
  "gradient-navy",
  "gradient-sage",
  "gradient-lilac",
  "gradient-salmon",
] as const;

test.each(testEnvironments)(
  "AccentBox colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { ColumnLayout, AccentBox, Section, Heading, Text, Link },
  }) => {
    // Three columns: ten boxes in one or two columns outgrow the screenshot
    await render(
      <ColumnLayout l={[1, 1, 1]}>
        {backgroundColors.map((backgroundColor) => (
          <AccentBox key={backgroundColor} backgroundColor={backgroundColor}>
            <Section>
              <Heading>{firstLetterToUppercase(backgroundColor)}</Heading>
              <Text>Text</Text>
              <Link>Link</Link>
            </Section>
          </AccentBox>
        ))}
      </ColumnLayout>,
    );

    await testScreenshot("AccentBox colors");
  },
);

test.each(testEnvironments)(
  "AccentBox content (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      ColumnLayout,
      AccentBox,
      Section,
      Heading,
      Text,
      InlineCode,
      Badge,
      CopyButton,
      ActionGroup,
      Button,
    },
  }) => {
    await render(
      <ColumnLayout l={[1, 1, 1]}>
        {(["neutral", "navy", "gradient-sage"] as const).map(
          (backgroundColor) => (
            <AccentBox key={backgroundColor} backgroundColor={backgroundColor}>
              <Section>
                <Heading>{firstLetterToUppercase(backgroundColor)}</Heading>
                <Text>
                  Text with <InlineCode>InlineCode</InlineCode>
                </Text>
                <Badge>Badge</Badge>
                <CopyButton text="InlineCode" />
                <ActionGroup>
                  <Button color="secondary" variant="soft">
                    Secondary
                  </Button>
                  <Button>Primary</Button>
                </ActionGroup>
              </Section>
            </AccentBox>
          ),
        )}
      </ColumnLayout>,
    );

    await testScreenshot("AccentBox content");
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
