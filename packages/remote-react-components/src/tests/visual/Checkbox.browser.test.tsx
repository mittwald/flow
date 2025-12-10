import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import React from "react";
import { userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "Checkbox (%s)",
  async ({ container, render, components: { Flex, Checkbox } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Checkbox>Default</Checkbox>
        <Checkbox>Focus</Checkbox>
        <Checkbox isSelected>Selected</Checkbox>
        <Checkbox isIndeterminate>Indeterminate</Checkbox>
        <Checkbox isReadOnly>Readonly</Checkbox>
        <Checkbox isDisabled>Disabled</Checkbox>
        <Checkbox isDisabled isSelected>
          Disabled Selected
        </Checkbox>
      </Flex>,
    );

    await userEvent.tab();
    await userEvent.tab();

    await expect(container).toMatchScreenshot("Chat");
  },
);
