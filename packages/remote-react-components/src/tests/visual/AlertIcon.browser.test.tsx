import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";
import { statusTypes } from "@mittwald/flow-react-components/internal";

test.each(testEnvironments)(
  "AlertIcon states (%s)",
  async ({ testScreenshot, render, components: { AlertIcon, Flex } }) => {
    await render(
      <Flex gap="s">
        {statusTypes.map((status) => (
          <AlertIcon key={status} status={status} />
        ))}
      </Flex>,
    );

    await testScreenshot("AlertIcon states");
  },
);
