import Button from "@/components/Button";
import Content from "@/components/Content";
import Heading from "@/components/Heading";
import Modal from "@/components/Modal/Modal";
import Notification from "@/components/Notification/Notification";
import {
  NotificationProvider,
  useNotificationController,
} from "@/components/NotificationProvider";
import type NotificationController from "@/components/NotificationProvider/NotificationController";
import Text from "@/components/Text";
import { useOverlayController } from "@/lib/controller";
import { sleep } from "@/lib/promises/sleep";
import type { FC } from "react";
import { useEffect } from "react";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

const onClose = vitest.fn();

const notify = (controller: NotificationController) =>
  controller.add(
    <Notification onClose={onClose}>
      <Heading>Saved</Heading>
      <Text>Your changes have been stored.</Text>
    </Notification>,
  );

const modalContent = (
  <>
    <Heading>Install</Heading>
    <Content>
      <Text>Hello World</Text>
    </Content>
  </>
);

/**
 * React-aria's `ariaHideOutside` sets `inert` on every `document.body` child
 * outside the open overlay, and an `inert` node stays visible but takes no
 * input. The notification container is portalled into `document.body`, so it
 * only escapes that isolation by being an always-visible node itself.
 */
const expectNotificationIsInteractive = async () => {
  onClose.mockClear();

  const notification = document.querySelector('[role="alert"]') as HTMLElement;
  const container = notification.closest("body > div") as HTMLElement;
  expect(container.inert).toBe(false);

  const { x, y, width, height } = notification.getBoundingClientRect();
  expect(
    notification.contains(
      document.elementFromPoint(x + width / 2, y + height / 2),
    ),
  ).toBe(true);

  const closeButton = notification.querySelector("button") as HTMLElement;
  await page.elementLocator(closeButton).click();
  expect(onClose).toHaveBeenCalled();
};

test("a notification raised while a modal is open stays interactive", async () => {
  const Fixture: FC = () => {
    const modal = useOverlayController("Modal", { isDefaultOpen: true });
    const controller = useNotificationController();

    useEffect(() => {
      const timeout = setTimeout(() => notify(controller), 300);
      return () => clearTimeout(timeout);
    }, [controller]);

    return <Modal controller={modal}>{modalContent}</Modal>;
  };

  render(
    <NotificationProvider>
      <Fixture />
    </NotificationProvider>,
  );

  await sleep(1000);

  await expectNotificationIsInteractive();
});

test("a notification raised before a modal opens stays interactive", async () => {
  const Fixture: FC = () => {
    const modal = useOverlayController("Modal");
    const controller = useNotificationController();

    useEffect(() => void notify(controller), [controller]);

    return (
      <>
        <Button onPress={() => modal.open()}>Open</Button>
        <Modal controller={modal}>{modalContent}</Modal>
      </>
    );
  };

  const dom = await render(
    <NotificationProvider>
      <Fixture />
    </NotificationProvider>,
  );

  await sleep(500);
  await dom.getByRole("button", { name: "Open" }).click();
  await sleep(500);

  await expectNotificationIsInteractive();
});
