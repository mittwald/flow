import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Checkbox states (%s)",
  async ({ testScreenshot, render, components: { Flex, Checkbox } }) => {
    await render(
      <Flex direction="column" gap="m">
        <Checkbox>Default</Checkbox>
        <Checkbox isSelected>Selected</Checkbox>
        <Checkbox isIndeterminate>Indeterminate</Checkbox>
        <Checkbox isReadOnly>Readonly</Checkbox>
        <Checkbox isDisabled>Disabled</Checkbox>
        <Checkbox isDisabled isSelected>
          Disabled Selected
        </Checkbox>
      </Flex>,
    );

    await testScreenshot("Checkbox states");
  },
);

// CheckboxButton dropped its wrapper <div>s in alpha.884 (bisected: fails at
// 883, passes at 884+), so the element tree only matches from there.
test.skipIf(crossVersion({ below: "0.2.0-alpha.884" })).each(testEnvironments)(
  "Checkbox edge cases(%s)",
  async ({ testScreenshot, render, components: { Checkbox } }) => {
    await render(
      <Checkbox>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
        quam quas vel voluptas, ullam aliquid fugit. Voluptate harum accusantium
        rerum ullam modi blanditiis vitae, laborum ea tempore, dolore voluptas.
        Earum pariatur, similique corrupti id officia perferendis. Labore,
        similique.
      </Checkbox>,
    );

    await testScreenshot("Checkbox edge cases");
  },
);
