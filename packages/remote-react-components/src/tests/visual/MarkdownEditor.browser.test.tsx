import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "MarkdownEditor states (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, MarkdownEditor, Label, FieldError },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <MarkdownEditor rows={1}>
          <Label>Default</Label>
        </MarkdownEditor>
        <MarkdownEditor rows={1} showCharacterCount>
          <Label>With character count</Label>
        </MarkdownEditor>
        <MarkdownEditor rows={1} isInvalid>
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </MarkdownEditor>
        <MarkdownEditor rows={1} isReadOnly>
          <Label>Readonly</Label>
        </MarkdownEditor>
        <MarkdownEditor rows={1} isDisabled>
          <Label>Disabled</Label>
        </MarkdownEditor>
      </Flex>,
    );

    await testScreenshot("MarkdownEditor states");
  },
);

test.each(testEnvironments)(
  "MarkdownEditor interaction (%s)",
  async ({ testScreenshot, render, components: { MarkdownEditor, Label } }) => {
    await render(
      <MarkdownEditor autoResizeMaxRows={3} rows={2}>
        <Label>Label</Label>
      </MarkdownEditor>,
    );

    const input = page.getByLocator("textarea");
    const preview = page.getByText("Preview");

    await testScreenshot("MarkdownEditor - default");

    await userEvent.type(input, "A{Enter}**B**{Enter}C{Enter}D");
    input.element().scroll({
      top: 1000,
    });

    await testScreenshot("MarkdownEditor - text entered");

    await preview.click();

    await testScreenshot("MarkdownEditor - preview");
  },
);
