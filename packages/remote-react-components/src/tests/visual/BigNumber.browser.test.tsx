import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

test.each(testEnvironments)(
  "BigNumber (%s)",
  async ({ container, render, components: { BigNumber, Text } }) => {
    await render(
      <BigNumber>
        <Text>65%</Text>
        <Text>Performance</Text>
      </BigNumber>,
    );

    await expect(container).toMatchScreenshot("BigNumber");
  },
);
