import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page } from "vitest/browser";

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
    "name": "Death Star"
}`}
        />

        <CodeBlock>
          A long time ago in a galaxy far, far away, the Rebels.
          <br />
          <Color color="danger">
            A long time ago in a galaxy far, far away, the Rebels.
          </Color>
          <br />A long time ago in a galaxy far, far away, the Rebels.
        </CodeBlock>
      </Flex>,
    );

    await testScreenshot("CodeBlock");
  },
);

// Element tree comparable from alpha.883.
test.skipIf(crossVersion({ below: "0.2.0-alpha.883" })).each(testEnvironments)(
  "CodeBlock truncated (%s)",
  async ({ testScreenshot, render, components: { CodeBlock, Flex } }) => {
    const code = `{
  "name": "Death Star"
  "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",
  "shortId": "p-123456",
  "createdAt": "2025-08-25T06:11:21.000Z",
  "enabled": true,
  "status": "ready",
  "serverId": "830d3c18-2d32-4768-b6a0-7e8b424a1271",
  "serverShortId": "s-123456",
}`;

    await render(
      <Flex direction="column" gap="m">
        <CodeBlock language="json" code={code} truncateLines={4} />
        <CodeBlock
          language="json"
          code={code}
          showLineNumbers
          truncateLines={4}
        />
      </Flex>,
    );

    /* A mouse click leaves no focus ring in the captures. */
    const toggles = page.getByRole("button", { name: /show (more|less)/i });

    await toggles.nth(0).click();
    await toggles.nth(1).click();

    await testScreenshot("CodeBlock truncated - expanded");

    await toggles.nth(0).click();
    await toggles.nth(1).click();

    await testScreenshot("CodeBlock truncated - collapsed");
  },
);
