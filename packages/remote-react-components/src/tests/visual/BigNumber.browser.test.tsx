import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

test.each(testEnvironments)(
  "BigNumber (%s)",
  async ({ testScreenshot, render, components: { BigNumber, Text } }) => {
    await render(
      <BigNumber>
        <Text>65%</Text>
        <Text>Performance</Text>
      </BigNumber>,
    );

    await testScreenshot("BigNumber");
  },
);
