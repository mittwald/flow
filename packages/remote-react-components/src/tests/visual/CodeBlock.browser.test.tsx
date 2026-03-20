import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "CodeBlock (%s)",
  async ({
    testScreenshot,
    render,
    components: { CodeBlock, Flex, Color },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <CodeBlock
          copyable
          language="json"
          showLineNumbers
          code={`{
    "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",
    "name": "My Project"
}`}
        />

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
