import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import React from "react";

test.each(testEnvironments)(
  "NumberField states (%s)",
  async ({
    container,
    render,
    components: {
      Flex,
      NumberField,
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
        <NumberField isRequired>
          <Label>
            Default
            <ContextualHelpTrigger>
              <Button />
              <ContextualHelp />
            </ContextualHelpTrigger>
          </Label>
          <FieldDescription>FieldDescription</FieldDescription>
        </NumberField>
        <NumberField isInvalid>
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </NumberField>
        <NumberField isReadOnly>
          <Label>Readonly</Label>
        </NumberField>
        <NumberField isDisabled>
          <Label>Disabled</Label>
        </NumberField>
        <NumberField
          formatOptions={{
            style: "unit",
            unit: "gigabyte",
          }}
          defaultValue={12}
        >
          <Label>Unit</Label>
        </NumberField>
        <NumberField minValue={5} defaultValue={5}>
          <Label>Disabled increment</Label>
        </NumberField>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("MarkdownEditor states");
  },
);

test.each(testEnvironments)(
  "NumberField interaction (%s)",
  async ({ container, render, components: { NumberField, Label } }) => {
    await render(
      <NumberField>
        <Label>Label</Label>
      </NumberField>,
    );

    const input = page.getByLocator("input");

    await expect(container).toMatchScreenshot(
      "NumberField interaction - default",
    );

    await userEvent.type(input, "3");

    await expect(container).toMatchScreenshot(
      "MarkdownEditor interaction - number entered",
    );

    const increment = page.getByLocator('[slot="increment"]');
    await increment.click();

    await expect(container).toMatchScreenshot(
      "MarkdownEditor interaction - increment clicked",
    );
  },
);
