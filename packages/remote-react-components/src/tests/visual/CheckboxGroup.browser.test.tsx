import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import React from "react";

test.each(testEnvironments)(
  "CheckboxGroup (%s)",
  async ({
    container,
    render,
    components: {
      Flex,
      Checkbox,
      CheckboxGroup,
      Label,
      FieldError,
      CheckboxButton,
    },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <CheckboxGroup>
          <Label>Default</Label>
          <Checkbox>Checkbox 1</Checkbox>
          <Checkbox>Checkbox 2</Checkbox>
        </CheckboxGroup>
        <CheckboxGroup isReadOnly>
          <Label>Readonly</Label>
          <Checkbox>Checkbox 1</Checkbox>
          <Checkbox>Checkbox 2</Checkbox>
        </CheckboxGroup>
        <CheckboxGroup isDisabled>
          <Label>Disabled</Label>
          <Checkbox>Checkbox 1</Checkbox>
          <Checkbox>Checkbox 2</Checkbox>
        </CheckboxGroup>
        <CheckboxGroup isInvalid>
          <Label>Invalid</Label>
          <Checkbox>Checkbox 1</Checkbox>
          <Checkbox>Checkbox 2</Checkbox>
          <FieldError>FieldError</FieldError>
        </CheckboxGroup>
        <CheckboxGroup>
          <Label>Buttons</Label>
          <CheckboxButton>CheckboxButton 1</CheckboxButton>
          <CheckboxButton>CheckboxButton 2</CheckboxButton>
        </CheckboxGroup>
        <CheckboxGroup l={[1, 1, 1]} m={[1, 1]}>
          <Label>ColumnLayout</Label>
          <Checkbox>Checkbox 1</Checkbox>
          <Checkbox>Checkbox 2</Checkbox>
        </CheckboxGroup>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("CheckboxGroup");
  },
);
