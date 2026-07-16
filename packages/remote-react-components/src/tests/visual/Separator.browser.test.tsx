import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Separator (%s)",
  async ({ testScreenshot, render, components: { Separator, Flex, Text } }) => {
    await render(
      <Flex direction="column" gap="xl">
        <Flex gap="m" direction="column">
          <Text align="center">
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a blow against the Galactic Empire. Rebel spies stole secret plans
            to the Death Star, the Empire's ultimate weapon, from the fortress
            world of Scarif.
          </Text>
          <Separator />
          <Text align="center">
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a blow against the Galactic Empire. Rebel spies stole secret plans
            to the Death Star, the Empire's ultimate weapon, from the fortress
            world of Scarif.
          </Text>
        </Flex>
        <Flex gap="m">
          <Text align="center">
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a blow against the Galactic Empire. Rebel spies stole secret plans
            to the Death Star, the Empire's ultimate weapon, from the fortress
            world of Scarif.
          </Text>
          <Separator orientation="vertical" />
          <Text align="center">
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a blow against the Galactic Empire. Rebel spies stole secret plans
            to the Death Star, the Empire's ultimate weapon, from the fortress
            world of Scarif.
          </Text>
        </Flex>
      </Flex>,
    );

    await testScreenshot("Separator");
  },
);
