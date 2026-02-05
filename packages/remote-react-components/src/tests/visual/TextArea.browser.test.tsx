import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "TextArea states (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      Flex,
      TextArea,
      Label,
      FieldError,
      FieldDescription,
      ContextualHelpTrigger,
      ContextualHelp,
      Button,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <TextArea rows={1} isRequired>
          <Label>
            Default
            <ContextualHelpTrigger>
              <Button />
              <ContextualHelp />
            </ContextualHelpTrigger>
          </Label>
          <FieldDescription>FieldDescription</FieldDescription>
        </TextArea>
        <TextArea rows={1} showCharacterCount>
          <Label>With character count</Label>
        </TextArea>
        <TextArea rows={1} isInvalid>
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </TextArea>
        <TextArea rows={1} isReadOnly>
          <Label>Readonly</Label>
        </TextArea>
        <TextArea rows={1} isDisabled>
          <Label>Disabled</Label>
        </TextArea>
        <TextArea rows={1} allowResize>
          <Label>Resizeable</Label>
        </TextArea>
      </Flex>,
    );

    await testScreenshot("TextArea states");
  },
);

test.each(testEnvironments)(
  "TextArea interaction (%s)",
  async ({ testScreenshot, render, components: { TextArea, Label } }) => {
    await render(
      <TextArea autoResizeMaxRows={3} rows={2}>
        <Label>Label</Label>
      </TextArea>,
    );

    const input = page.getByLocator("textarea");

    await testScreenshot("TextArea - default");

    await userEvent.type(input, "A{Enter}B{Enter}C{Enter}D");

    /**
     * Scroll textarea to the end, because textarea with max-height and padding
     * does not scroll to the "full" end when adding new lines
     */
    input.element().scroll({
      top: 1000,
    });

    await testScreenshot("TextArea - text entered");
  },
);
