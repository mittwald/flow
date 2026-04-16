import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "CodeEditor (%s)",
  async ({ testScreenshot, render, components: { CodeEditor, Flex } }) => {
    await render(
      <Flex direction="column" gap="m">
        <CodeEditor
          language="json"
          value={`{
    "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",
    "name": "My Project"
}`}
        />
      </Flex>,
    );

    await testScreenshot("CodeEditor");
  },
);
