import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { userEvent, page } from "vitest/browser";

test.each(testEnvironments)(
  "ComboBox states (%s)",
  async ({
    container,
    render,
    components: { Flex, ComboBox, Option, Label, FieldError, FieldDescription },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <ComboBox>
          <Label>Default</Label>
          <Option>Option 1</Option>
          <Option>Option 2</Option>
          <FieldDescription>FieldDescription</FieldDescription>
        </ComboBox>
        <ComboBox isInvalid>
          <Label>Invalid</Label>
          <Option>Option 1</Option>
          <Option>Option 2</Option>
          <FieldError>FieldError</FieldError>
        </ComboBox>
        <ComboBox isReadOnly>
          <Label>Readonly</Label>
          <Option>Option 1</Option>
          <Option>Option 2</Option>
        </ComboBox>
        <ComboBox isDisabled>
          <Label>Disabled</Label>
          <Option>Option 1</Option>
          <Option>Option 2</Option>
        </ComboBox>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("ComboBox states");
  },
);

test.each(testEnvironments)(
  "ComboBox interaction (%s)",
  async ({ container, render, components: { ComboBox, Label, Option } }) => {
    await render(
      <ComboBox>
        <Label>Label</Label>
        <Option data-testid="option">Option 1</Option>
        <Option>Option 2</Option>
      </ComboBox>,
    );

    const input = page.getByLocator("input");
    const option = page.getByTestId("option");

    await expect(container).toMatchScreenshot("ComboBox - default");

    await userEvent.tab();

    await userEvent.type(input, "o");

    await expect(container).toMatchScreenshot("ComboBox - options visible");

    await option.click();

    await expect(container).toMatchScreenshot("ComboBox - option selected");
  },
);
