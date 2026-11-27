import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { waitForHighlightedCode } from "@/tests/lib/codeHighlighting";
import { rootContainerLocator } from "@/tests/lib/RootContainer";
import { expect, test } from "vitest";

/*
 * The linter runs debounced after the editor is created, so its markers appear
 * well after the code is highlighted.
 */
const waitForLintMarkers = async (markers: number) => {
  await expect
    .poll(
      () =>
        rootContainerLocator.element().querySelectorAll(".cm-lint-marker")
          .length,
      {
        timeout: 20_000,
      },
    )
    .toBe(markers);
};

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
          minHeight="100px"
          language="json"
          value={`{
    "minHeight": "100px"
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
        <CodeEditor
          language="dotEnv"
          value={`DATABASE_URL=postgres://localhost:5432/app
api_key=secret
DATABASE_URL=postgres://localhost:5432/other`}
        >
          <Label>Linter</Label>
        </CodeEditor>
      </Flex>,
    );

    await waitForHighlightedCode(4);
    // dotEnv sets no `data-language`, so its editor waits for the markers.
    await waitForLintMarkers(2);

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

    await waitForHighlightedCode(1);

    await testScreenshot("CodeEditor disabled");
  },
);
