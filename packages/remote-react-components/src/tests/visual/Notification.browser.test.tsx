import { testEnvironments } from "@/tests/lib/environments";
import { firstLetterToUppercase } from "@/tests/lib/firstLetterToUppercase";
import { expect, test } from "vitest";
import { page } from "vitest/browser";

const states = ["info", "success", "warning", "danger"] as const;

test.each(testEnvironments)(
  "Notification (%s)",
  async ({
    container,
    render,
    components: { Notification, Flex, Heading, Text },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        {states.map((status) => (
          <Notification status={status} key={status}>
            <Heading>{firstLetterToUppercase(status)}</Heading>
            <Text>Text</Text>
          </Notification>
        ))}
        <Notification
          data-testid="notification"
          onClose={() => console.log("onClose")}
          onClick={() => console.log("onClick")}
        >
          <Heading>Heading</Heading>
          <Text>Text</Text>
        </Notification>
      </Flex>,
    );

    const notification = page.getByTestId("notification");
    await notification.click();

    await expect(container).toMatchScreenshot("Notification");
  },
);
