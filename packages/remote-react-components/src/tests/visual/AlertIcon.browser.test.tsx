import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

const alertIconStates = ["info", "success", "warning", "danger"] as const;

test.each(testEnvironments)(
  "AlertIcon states (%s)",
  async ({ container, render, components: { AlertIcon, Flex } }) => {
    await render(
      <Flex gap="s">
        {alertIconStates.map((status) => (
          <AlertIcon key={status} status={status} />
        ))}
      </Flex>,
    );

    await expect(container).toMatchScreenshot("AlertIcon states");
  },
);
