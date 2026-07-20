import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
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
          A long time ago in a <Kbd keys={["mod", "k"]} /> galaxy far, far away.
        </Text>
        <Kbd isDisabled variant="soft">
          k
        </Kbd>
      </Flex>,
    );

    await testScreenshot("Kbd");
  },
);
