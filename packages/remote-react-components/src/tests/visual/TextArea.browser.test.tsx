import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import React from "react";

test.each(testEnvironments)(
  "TextArea states (%s)",
  async ({
    container,
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
      </Flex>,
    );

    await expect(container).toMatchScreenshot("TextArea states");
  },
);

test.each(testEnvironments)(
  "TextArea interaction (%s)",
  async ({ container, render, components: { TextArea, Label } }) => {
    await render(
      <TextArea autoResizeMaxRows={3} rows={2}>
        <Label>Label</Label>
      </TextArea>,
    );

    const input = page.getByLocator("textarea");

    await expect(container).toMatchScreenshot("TextArea - default");

    await userEvent.type(input, "A\nB\nC\nD");

    await expect(container).toMatchScreenshot("TextArea - text entered");
  },
);
