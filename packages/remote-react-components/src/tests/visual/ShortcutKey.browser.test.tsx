import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "ShortcutKey (%s)",
  async ({
    testScreenshot,
    render,
    components: { ShortcutKey, Flex, SearchField },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <ShortcutKey keys={["mod", "alt", "shift"]} />
        <ShortcutKey>k</ShortcutKey>
        <ShortcutKey isDisabled>k</ShortcutKey>
        <SearchField aria-label="search">
          <ShortcutKey keys={["mod", "k"]} />
        </SearchField>
      </Flex>,
    );

    await testScreenshot("ShortcutKey");
  },
);
