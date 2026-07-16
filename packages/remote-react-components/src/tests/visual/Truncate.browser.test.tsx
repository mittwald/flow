import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "Truncate (%s)",
  async ({
    testScreenshot,
    render,
    components: { Text, Flex, Truncate, Heading },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Truncate>
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. During the battle, rebel
          spies managed to steal secret plans to the Empire's ultimate weapon,
          the Death Star, an armored space station with enough power to destroy
          an entire planet.
        </Truncate>
        <Text>
          <Truncate>
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. During the battle,
            rebel spies managed to steal secret plans to the Empire's ultimate
            weapon, the Death Star, an armored space station with enough power
            to destroy an entire planet.
          </Truncate>
        </Text>
        <Heading>
          <Truncate>
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. During the battle,
            rebel spies managed to steal secret plans to the Empire's ultimate
            weapon, the Death Star, an armored space station with enough power
            to destroy an entire planet.
          </Truncate>
        </Heading>
        <Text>
          <Truncate offset={10} ellipsis="[...]">
            A long time ago in a galaxy far, far away, the Rebel Alliance struck
            a decisive blow against the Galactic Empire. During the battle,
            rebel spies managed to steal secret plans to the Empire's ultimate
            weapon, the Death Star, an armored space station with enough power
            to destroy an entire planet.
          </Truncate>
        </Text>
      </Flex>,
    );

    await testScreenshot("Truncate");
  },
);
