import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page } from "vitest/browser";

test.each(testEnvironments)(
  "Open modal with trigger (%s)",
  async ({
    container,
    render,
    components: { Button, ModalTrigger, Modal, Content, Heading, ActionGroup },
  }) => {
    await render(
      <ModalTrigger>
        <Button data-testid="open">Open</Button>
        <Modal>
          <Heading>Modal Heading</Heading>
          <Content>Modal Content</Content>
          <ActionGroup>
            <Button>OK</Button>
          </ActionGroup>
        </Modal>
      </ModalTrigger>,
    );

    const openButton = page.getByTestId("open");
    await openButton.click();

    await expect(container).toMatchScreenshot(
      "Open modal with trigger - opened",
    );
  },
);
