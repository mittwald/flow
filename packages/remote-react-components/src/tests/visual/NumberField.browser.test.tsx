import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "NumberField states (%s)",
  async ({
    testScreenshot,
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
        <NumberField maxValue={5} defaultValue={5}>
          <Label>Disabled decrement</Label>
        </NumberField>
      </Flex>,
    );

    await testScreenshot("NumberField states");
  },
);

test.each(testEnvironments)(
  "NumberField interaction (%s)",
  async ({ testScreenshot, render, components: { NumberField, Label } }) => {
    await render(
      <NumberField>
        <Label>Label</Label>
      </NumberField>,
    );

    const input = page.getByLocator("input");

    await testScreenshot("NumberField interaction - default");

    await userEvent.type(input, "3");

    await testScreenshot("NumberField interaction - number entered");

    const increment = page.getByLocator('[slot="increment"]');
    await increment.click();

    await testScreenshot("NumberField interaction - increment clicked");
  },
);
