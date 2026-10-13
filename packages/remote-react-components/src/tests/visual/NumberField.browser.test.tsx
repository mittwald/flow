import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "NumberField states (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      ColumnLayout,
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
      <ColumnLayout m={[1, 1]} l={[1, 1]}>
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
        <NumberField unit="MiB" defaultValue={512}>
          <Label>Custom unit</Label>
        </NumberField>
        <NumberField unit="MiB" defaultValue={512} isDisabled>
          <Label>Custom unit disabled</Label>
        </NumberField>
        <NumberField minValue={5} defaultValue={5}>
          <Label>Disabled increment</Label>
        </NumberField>
        <NumberField maxValue={5} defaultValue={5}>
          <Label>Disabled decrement</Label>
        </NumberField>
        {/* A custom unit is cut off where the input cuts off its text */}
        <ColumnLayout m={[1, 1]} l={[1, 1]}>
          <NumberField
            formatOptions={{
              style: "unit",
              unit: "gigabyte",
              unitDisplay: "long",
            }}
            defaultValue={123456789012345}
          >
            <Label>Unit overflow</Label>
          </NumberField>
          <NumberField unit="gigabytes" defaultValue={123456789012345}>
            <Label>Custom unit overflow</Label>
          </NumberField>
        </ColumnLayout>
      </ColumnLayout>,
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
