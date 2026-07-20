import { testEnvironments } from "@/tests/lib/environments";
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

test.each(testEnvironments)(
  "Checkbox edge cases(%s)",
  async ({ testScreenshot, render, components: { Checkbox } }) => {
    await render(
      <Checkbox>
        A long time ago in a galaxy far, far away, the Rebel Alliance struck a
        decisive blow against the Galactic Empire. Rebel spies managed to steal
        secret plans to the Empire's ultimate weapon, the Death Star, an armored
        space station with enough power to destroy an entire planet. Pursued by
        agents, Leia races home.
      </Checkbox>,
    );

    await testScreenshot("Checkbox edge cases");
  },
);
