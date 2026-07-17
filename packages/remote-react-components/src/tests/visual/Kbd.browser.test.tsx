import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

// Kbd is available from alpha.791.
test.skipIf(crossVersion({ below: "0.2.0-alpha.791" })).each(testEnvironments)(
  "Kbd (%s)",
  async ({
    testScreenshot,
    render,
    components: { Kbd, Flex, SearchField, Text },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <Kbd keys={["mod", "alt", "shift"]} />
        <Kbd>
          <Kbd keys={["mod"]} /> + <Kbd keys={["k"]} />, <Kbd keys={["mod"]} />{" "}
          + <Kbd keys={["c"]} />
        </Kbd>
        <Kbd isDisabled>k</Kbd>
        <SearchField aria-label="search">
          <Kbd keys={["mod", "k"]} />
        </SearchField>
        <Text>
          Lorem ipsum dolor sit amet <Kbd keys={["mod", "k"]} /> consectetur
          adipisicing elit.
        </Text>
        <Kbd isDisabled variant="soft">
          k
        </Kbd>
      </Flex>,
    );

    await testScreenshot("Kbd");
  },
);
