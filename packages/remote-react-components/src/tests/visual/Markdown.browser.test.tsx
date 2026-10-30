import { testEnvironments } from "@/tests/lib/environments";
import { waitForHighlightedCode } from "@/tests/lib/codeHighlighting";
import { alphaColorAccentBoxBackground } from "@/tests/lib/alphaColorAccentBoxBackground";
import { test } from "vitest";
import logo from "@/tests/assets/mittwald_logo_landscape.jpg";
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
    components: { Markdown, ColumnLayout, Wrap, AccentBox },
  }) => {
    await render(
      <ColumnLayout s={[1, 1, 1, 1, 1]} gap="s">
        {colors.map((color) => (
          <Wrap if={isAlphaColor(color)} key={color}>
            <AccentBox backgroundColor={alphaColorAccentBoxBackground(color)}>
              <Markdown color={color}>
                {"## Heading 2\n" +
                  "A long time ago in a galaxy **far, far away** the Rebel Alliance struck  \n`a decisive blow` against the [Galactic Empire](https://example.com).\n\n" +
                  "- [x] Steal the plans\n" +
                  "- [ ] Destroy the Death Star\n\n" +
                  "```json\n" +
                  '{ "name": "DS-1" }\n' +
                  "```\n\n" +
                  "| Pilot | Squadron |\n" +
                  "|-------|----------|\n" +
                  "| Luke  | Red Five |\n" +
                  "| Wedge | Red Two  |\n\n" +
                  `![mittwald](${logo})`}
              </Markdown>
            </AccentBox>
          </Wrap>
        ))}
      </ColumnLayout>,
    );

    await waitForHighlightedCode(colors.length);

    await testScreenshot("Markdown colors");
  },
);

test.each(testEnvironments)(
  "Markdown content (%s)",
  async ({ testScreenshot, render, components: { Markdown } }) => {
    await render(
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
          "> Block quote" +
          "\n - Unordered list item 1 \n - Unordered list item 2 " +
          "\n 1. Ordered list item 1 \n 2. Ordered list item 2\n\n" +
          "| Column 1       | Column 2      |\n" +
          "|---------------|---------------|\n" +
          "| Row 1 Cell 1  | Row 1 Cell 2  |\n" +
          "| Row 2 Cell 1  | Row 2 Cell 2  |\n" +
          "| Row 3 Cell 1  | Row 3 Cell 2  |\n"}
      </Markdown>,
    );

    await waitForHighlightedCode(1);

    await testScreenshot("Markdown content");
  },
);

test.each(testEnvironments)(
  "Markdown split ordered list (%s)",
  async ({ testScreenshot, render, components: { Markdown } }) => {
    await render(
      <Markdown>
        {"1. Destroy the shield generator\n\n" +
          "Endor hosts the generator.\n\n" +
          "2. Lure the fleet into a trap\n\n" +
          "The Emperor expects the attack.\n\n" +
          "3. Fly into the Death Star\n" +
          "4. Hit the main reactor"}
      </Markdown>,
    );

    await testScreenshot("Markdown split ordered list");
  },
);

test.each(testEnvironments)(
  "Markdown wide table (%s)",
  async ({ testScreenshot, render, components: { Markdown } }) => {
    const columns = Array.from({ length: 12 }, (_, i) => `Column ${i + 1}`);
    const cells = columns.map((_, i) => `p-${i}abc123.project.space`);

    await render(
      <Markdown>
        {`| ${columns.join(" | ")} |\n` +
          `|${columns.map(() => "---").join("|")}|\n` +
          `| ${cells.join(" | ")} |\n`}
      </Markdown>,
    );

    await testScreenshot("Markdown wide table");
  },
);
