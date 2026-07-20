import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import { statusTypes } from "@mittwald/flow-react-components/internal";

test.each(testEnvironments)(
  "AlertText states (%s)",
  async ({ testScreenshot, render, components: { AlertText, Flex } }) => {
    await render(
      <Flex direction="column" gap="m">
        {statusTypes.map((status) => (
          <AlertText key={status} status={status}>
            {firstLetterToUppercase(status)}
          </AlertText>
        ))}
      </Flex>,
    );

    await testScreenshot("AlertText states");
  },
);

test.each(testEnvironments)(
  "AlertText edge cases (%s)",
  async ({
    testScreenshot,
    render,
    components: { AlertText, Flex, Text, Heading },
  }) => {
    await render(
      <Flex direction="column">
        <AlertText>
          A long time ago in a galaxy far, far away, the Rebel Alliance struck a
          decisive blow against the Galactic Empire. Rebel spies managed to
          steal secret plans to the Empire's ultimate weapon, the Death Star, an
          armored space station.
        </AlertText>
        <Text>
          A long time ago in a galaxy far, far away the Rebel Alliance struck a
          blow against the Empire
          <AlertText>
            A long time ago in a galaxy far, far away the Rebel Alliance struck
            a blow against the Empire
          </AlertText>
          A long time ago in a galaxy far, far away the Rebel Alliance struck a
          blow against the Empire
        </Text>
        <Heading>
          <AlertText>
            A long time ago in a galaxy far, far away the Empire finally fell
          </AlertText>
        </Heading>
      </Flex>,
    );

    await testScreenshot("AlertText edge cases");
  },
);
