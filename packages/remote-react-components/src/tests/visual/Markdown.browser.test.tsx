import { testEnvironments } from "@/tests/lib/environments";
import { waitForHighlightedCode } from "@/tests/lib/codeHighlighting";
import { alphaColorAccentBoxBackground } from "@/tests/lib/alphaColorAccentBoxBackground";
import { test } from "vitest";
import {
  alphaColors,
  isAlphaColor,
} from "@mittwald/flow-react-components/internal";

const colors = ["default", ...alphaColors] as const;

test.each(testEnvironments)(
  "Markdown colors (%s)",
  async ({
    testScreenshot,
    render,
    components: { Markdown, Flex, Wrap, AccentBox },
  }) => {
    await render(
      <Flex gap="m" direction="column">
        {colors.map((color) => (
          <Wrap if={isAlphaColor(color)} key={color}>
            <AccentBox backgroundColor={alphaColorAccentBoxBackground(color)}>
              <Markdown color={color}>
                {"## Heading 2\n" +
                  "A long time ago in a galaxy **far, far away** the Rebel Alliance struck `a decisive blow` against the [Galactic Empire](https://example.com)."}
              </Markdown>
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await testScreenshot("Markdown colors");
  },
);

test.each(testEnvironments)(
  "Markdown content (%s)",
  async ({
    testScreenshot,
    render,
    components: { Markdown, Section, Heading, ColumnLayout },
  }) => {
    await render(
      <ColumnLayout l={[1, 1]} m={[1, 1]} s={[1, 1]} columnGap="xl">
        {/* The section's heading id and class must not reach the markdown headings. */}
        <Section>
          <Heading>Section</Heading>
          <Markdown>
            {"# Heading 1\n" +
              "## Heading 2\n" +
              "A long time ago in a galaxy **far, far away** the Rebel Alliance struck `a decisive blow` against the Empire.\n" +
              "```json\n" +
              "{\n" +
              '    "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",\n' +
              '    "name": "Death Star"\n' +
              "}\n" +
              "```\n" +
              "[link](#)\n" +
              "> Block quote"}
          </Markdown>
        </Section>
        <Markdown>
          {" - Unordered list item 1 \n - Unordered list item 2 " +
            "\n 1. Ordered list item 1 \n 2. Ordered list item 2\n\n" +
            "| Column 1       | Column 2      |\n" +
            "|---------------|---------------|\n" +
            "| Row 1 Cell 1  | Row 1 Cell 2  |\n" +
            "| Row 2 Cell 1  | Row 2 Cell 2  |\n" +
            "| Row 3 Cell 1  | Row 3 Cell 2  |\n"}
        </Markdown>
      </ColumnLayout>,
    );

    await waitForHighlightedCode(1);

    await testScreenshot("Markdown content");
  },
);

test.each(testEnvironments)(
  "Markdown edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, Markdown, ColumnLayout },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Markdown>
          {"1. Destroy the shield generator\n\n" +
            "Endor hosts the generator.\n\n" +
            "2. Lure the fleet into a trap\n\n" +
            "The Emperor expects the attack.\n\n" +
            "3. Fly into the Death Star\n" +
            "4. Hit the main reactor"}
        </Markdown>
        {/* A narrow column, like the AIssistant drawer. */}
        <ColumnLayout s={[1, 4]} m={[1, 4]} l={[1, 4]}>
          <Markdown>
            {"| Type | Version | Usage |\n" +
              "| --- | --- | --- |\n" +
              "| CMS | 6.4 | WordPress, Shopware, TYPO3 |\n" +
              "| Shop | 6.5 | Shopware, Magento |\n"}
          </Markdown>
        </ColumnLayout>
      </Flex>,
    );

    await testScreenshot("Markdown edge cases");
  },
);
