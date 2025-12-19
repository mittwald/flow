import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const colors = ["default", "dark", "light"] as const;

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
          <Wrap if={color === "light"} key={color}>
            <AccentBox>
              <Markdown color={color}>
                {"## Heading 2\n" +
                  "Lorem ipsum dolor sit amet **consectetur adipisicing** elit. Cumque eius `quam quas vel voluptas` ullam aliquid fugit.\n" +
                  "```json\n" +
                  '"projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",\n' +
                  "```\n" +
                  "[link](#)\n"}
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
  async ({ testScreenshot, render, components: { Markdown } }) => {
    await render(
      <Markdown>
        {"# Heading 1\n" +
          "## Heading 2\n" +
          "Lorem ipsum dolor sit amet **consectetur adipisicing** elit. Cumque eius `quam quas vel voluptas` ullam aliquid fugit.\n" +
          "```json\n" +
          "{\n" +
          '    "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",\n' +
          '    "name": "My Project"\n' +
          "}\n" +
          "```\n" +
          "[link](#)\n" +
          "> Block quote" +
          "\n - Unordered list item 1 \n - Unordered list item 2 " +
          "\n 1. Ordered list item 1 \n 2. Ordered list item 2"}
      </Markdown>,
    );

    await testScreenshot("Markdown content");
  },
);
