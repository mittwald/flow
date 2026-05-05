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
  "CodeBlock truncated (%s)",
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
        truncateLines={4}
      />,
    );

    await userEvent.keyboard("{tab}");
    await userEvent.keyboard("{enter}");

    await testScreenshot("CodeBlock truncated - expanded");

    await userEvent.keyboard("{enter}");

    await testScreenshot("CodeBlock truncated - collapsed");
  },
);

test.each(testEnvironments)(
  "CodeBlock scrolled (%s)",
  async ({ testScreenshot, render, components: { CodeBlock } }) => {
    const { container } = await render(
      <CodeBlock
        code={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius quam quas vel voluptas, ullam aliquid fugit. Voluptate harum accusantium rerum ullam modi blanditiis vitae, laborum ea tempore, dolore voluptas.`}
      />,
    );

    const scroller = container.querySelector(".cm-scroller");

    if (!(scroller instanceof HTMLElement)) {
      throw new Error("cm-scroller not found or not HTMLElement");
    }

    scroller.style.overflowX = "scroll";

    scroller.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));

    scroller.scrollLeft = 300;
    scroller.dispatchEvent(new Event("scroll"));

    await new Promise((r) => setTimeout(r, 100));

    await testScreenshot("CodeBlock scrolled");
  },
);
