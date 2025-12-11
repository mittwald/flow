import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

const colors = ["default", "dark", "light"] as const;

test.each(testEnvironments)(
  "CodeBlock (%s)",
  async ({
    container,
    render,
    components: { CodeBlock, Flex, Wrap, AccentBox },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {colors.map((color) => (
          <Wrap if={color === "light"}>
            <AccentBox>
              <CodeBlock
                color={color}
                copyable
                showLineNumbers
                code={`{
    "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",
    "name": "My Project"
}`}
              />
            </AccentBox>
          </Wrap>
        ))}
      </Flex>,
    );

    await expect(container).toMatchScreenshot("CodeBlock");
  },
);
