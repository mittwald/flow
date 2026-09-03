import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "CheckboxButton states (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, CheckboxButton, Text, Content },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <CheckboxButton>Default</CheckboxButton>
        <CheckboxButton>
          <Text>Text</Text>
          <Content>Content</Content>
        </CheckboxButton>
        <CheckboxButton isSelected>Selected</CheckboxButton>
        <CheckboxButton isIndeterminate>Indeterminate</CheckboxButton>
        <CheckboxButton isReadOnly>Readonly</CheckboxButton>
        <CheckboxButton isDisabled>Disabled</CheckboxButton>
        <CheckboxButton isDisabled isSelected>
          Disabled Selected
        </CheckboxButton>
      </Flex>,
    );

    await testScreenshot("CheckboxButton states");
  },
);

// CheckboxButton's edge-case structure was flattened in alpha.926: up to
// alpha.921 it renders extra wrapper divs plus a duplicated measuring text node,
// current renders a flat label (verified deterministic, not a capture flake).
// Comparable only from alpha.926; older targets skip until a newer version ships.
test.skipIf(crossVersion({ below: "0.2.0-alpha.926" })).each(testEnvironments)(
  "CheckboxButton edge cases(%s)",
  async ({
    testScreenshot,
    render,
    components: { CheckboxButton, Text, Content, Flex },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <CheckboxButton>
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies managed to
          steal secret plans to the Empire's ultimate weapon, the Death Star, an
          armored space station with enough power to destroy an entire planet.
          Pursued by agents, Leia races home.
        </CheckboxButton>
        <CheckboxButton>
          <Text>
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. Rebel spies managed to
            steal secret plans to the Empire's ultimate weapon, the Death Star,
            an armored space station with enough power to destroy an entire
            planet. Pursued by agents, Leia races home.
          </Text>
          <Content>
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. Rebel spies managed to
            steal secret plans to the Empire's ultimate weapon, the Death Star,
            an armored space station with enough power to destroy an entire
            planet. Pursued by agents, Leia races home.
          </Content>
        </CheckboxButton>
      </Flex>,
    );

    await testScreenshot("CheckboxButton edge cases");
  },
);
