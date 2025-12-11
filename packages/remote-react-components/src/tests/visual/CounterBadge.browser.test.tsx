import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

test.each(testEnvironments)(
  "CounterBadge (%s)",
  async ({
    container,
    render,
    components: { Flex, CounterBadge, IconNotification, Button },
  }) => {
    await render(
      <Flex gap="s">
        <CounterBadge />
        <CounterBadge count={120} />
        <Button aria-label="Count: 7">
          <IconNotification />
          <CounterBadge count={7} />
        </Button>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("CounterBadge");
  },
);
