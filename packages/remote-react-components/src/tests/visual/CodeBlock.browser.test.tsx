import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const colors = ["default", "dark", "light"] as const;

test.each(testEnvironments)(
  "CodeBlock (%s)",
  async ({
    testScreenshot,
    render,
    components: { CodeBlock, Flex, Wrap, AccentBox, Color },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {colors.map((color) => (
          <Wrap if={color === "light"} key={color}>
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
        <CodeBlock>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          <br />
          <Color color="danger">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Color>
          <br />
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </CodeBlock>
      </Flex>,
    );

    await testScreenshot("CodeBlock");
  },
);
