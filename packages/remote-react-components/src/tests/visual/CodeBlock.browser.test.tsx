import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { userEvent } from "vitest/browser";

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

test.each(testEnvironments)(
  "CodeBlock expandable (%s)",
  async ({ testScreenshot, render, components: { CodeBlock } }) => {
    await render(
      <CodeBlock
        language="json"
        code={`{
  "name": "My Project"
  "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",
  "shortId": "p-123456",
  "createdAt": "2025-08-25T06:11:21.000Z",
  "enabled": true,
  "status": "ready",
  "serverId": "830d3c18-2d32-4768-b6a0-7e8b424a1271",
  "serverShortId": "s-123456",
}`}
        expandable
        expandAfterLines={4}
      />,
    );

    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{enter}");

    await testScreenshot("CodeBlock expandable - expanded");

    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{enter}");

    await testScreenshot("CodeBlock expandable - collapsed");
  },
);
