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
    components: {
      Notification,
      Heading,
      Text,
      Button,
      useNotificationController,
    },
  }) => {
    const TestComponent = () => {
      const notificationController = useNotificationController();

      const triggerNotifications = () => {
        states.forEach((status) =>
          notificationController.add(
            <Notification status={status} key={status}>
              <Heading>{firstLetterToUppercase(status)}</Heading>
              <Text>Text</Text>
            </Notification>,
          ),
        );

        notificationController.add(
          <Notification data-testid="notification">
            <Heading>Heading</Heading>
            <Text>Text</Text>
          </Notification>,
        );
      };

      return (
        <Button data-testid="trigger" onPress={triggerNotifications}>
          Trigger
        </Button>
      );
    };

    await render(<TestComponent />);

    const triggerButton = page.getByTestId("trigger");
    await triggerButton.click();

    await expect(container).toMatchScreenshot("Notification");
  },
);
