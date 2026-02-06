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
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua.
        </Truncate>
        <Text>
          <Truncate>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </Truncate>
        </Text>
        <Heading>
          <Truncate>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua.
          </Truncate>
        </Heading>
      </Flex>,
    );

    await testScreenshot("Truncate");
  },
);
