import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

// CodeEditor is available from alpha.791.
test.skipIf(crossVersion({ below: "0.2.0-alpha.791" })).each(testEnvironments)(
  "CodeEditor (%s)",
  async ({
    testScreenshot,
    render,
    components: { CodeEditor, Flex, Label, FieldDescription, FieldError },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <CodeEditor
          language="json"
          value={`{
    "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",
    "name": "My Project"
}`}
        />
        <CodeEditor
          minHeight="200px"
          language="json"
          value={`{
    "minHeight": "200px"
}`}
        />
        <CodeEditor
          language="json"
          value={`{
    "label": "is rendered above the editor"
}`}
        >
          <Label>Label</Label>
          <FieldDescription>FieldDescription</FieldDescription>
        </CodeEditor>
        <CodeEditor
          isInvalid
          language="json"
          value={`{
    "invalid":
}`}
        >
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </CodeEditor>
      </Flex>,
    );

    await testScreenshot("CodeEditor");
  },
);

// isDisabled ships on the next line. Which 1.5.0-next.N carries it first is
// not known yet, so the gate starts at 1.5.0.
test.skipIf(crossVersion({ below: "1.5.0" })).each(testEnvironments)(
  "CodeEditor disabled (%s)",
  async ({
    testScreenshot,
    render,
    components: { CodeEditor, Label, FieldDescription },
  }) => {
    await render(
      <CodeEditor
        isDisabled
        language="json"
        value={`{
    "disabled": true
}`}
      >
        <Label>Disabled</Label>
        <FieldDescription>FieldDescription</FieldDescription>
      </CodeEditor>,
    );

    await testScreenshot("CodeEditor disabled");
  },
);
