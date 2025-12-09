import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

type AlertIconStatus = "info" | "success" | "warning" | "danger";

const alertIconStates: AlertIconStatus[] = [
  "info",
  "success",
  "warning",
  "danger",
];

test.each(testEnvironments)(
  "AlertIcon states (%s)",
  async ({ container, render, components: { AlertIcon, Flex } }) => {
    await render(
      <Flex gap="s">
        {alertIconStates.map((status) => (
          <AlertIcon status={status} />
        ))}
      </Flex>,
    );

    await expect(container).toMatchScreenshot("AlertIcon states");
  },
);
