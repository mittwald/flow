import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import React from "react";
import { userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "Checkbox states (%s)",
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

    await expect(container).toMatchScreenshot("Checkbox states");
  },
);

test.each(testEnvironments)(
  "Checkbox edge cases(%s)",
  async ({ container, render, components: { Checkbox } }) => {
    await render(
      <Checkbox>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
        quam quas vel voluptas, ullam aliquid fugit. Voluptate harum accusantium
        rerum ullam modi blanditiis vitae, laborum ea tempore, dolore voluptas.
        Earum pariatur, similique corrupti id officia perferendis. Labore,
        similique.
      </Checkbox>,
    );

    await userEvent.tab();
    await userEvent.tab();

    await expect(container).toMatchScreenshot("Checkbox edge cases");
  },
);
