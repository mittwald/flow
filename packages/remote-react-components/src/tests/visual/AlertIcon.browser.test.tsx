import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

const states = ["info", "success", "warning", "danger"] as const;

test.each(testEnvironments)(
  "AlertIcon states (%s)",
  async ({ testScreenshot, render, components: { AlertIcon, Flex } }) => {
    await render(
      <Flex gap="s">
        {states.map((status) => (
          <AlertIcon key={status} status={status} />
        ))}
      </Flex>,
    );

    await testScreenshot("AlertIcon states");
  },
);
