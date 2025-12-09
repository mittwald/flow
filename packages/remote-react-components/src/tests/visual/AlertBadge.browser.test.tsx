import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";

type AlertBadgeStatus = "info" | "success" | "warning" | "danger";

const alertBadgeStates: AlertBadgeStatus[] = [
  "info",
  "success",
  "warning",
  "danger",
];

const firstLetterToUppercase = (text: string) => {
  return text[0]!.toUpperCase() + text.slice(1).toLowerCase();
};

test.each(testEnvironments)(
  "AlertBadge states (%s)",
  async ({ container, render, components: { AlertBadge, Flex } }) => {
    await render(
      <Flex gap="s">
        {alertBadgeStates.map((status) => (
          <AlertBadge status={status}>
            {firstLetterToUppercase(status)}
          </AlertBadge>
        ))}
      </Flex>,
    );

    await expect(container).toMatchScreenshot("AlertBadge states");
  },
);

test.each(testEnvironments)(
  "AlertBadge edge cases (%s)",
  async ({ container, render, components: { AlertBadge } }) => {
    await render(
      <AlertBadge>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque eius
        quam quas vel voluptas, ullam aliquid fugit. Voluptate harum accusantium
        rerum ullam modi blanditiis vitae, laborum ea tempore, dolore voluptas.
      </AlertBadge>,
    );

    await expect(container).toMatchScreenshot("AlertBadge edge cases");
  },
);
