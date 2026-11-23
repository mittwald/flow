import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page } from "vitest/browser";

/*
 * A `"layout"` flowComponent passes the props contexts around it through. The
 * remote counterpart has to do the same: `Modal` is a remote composition, so
 * its `Heading` context only reaches the heading if `LayoutCard` lets it pass.
 */
test.each(testEnvironments)(
  "a layout component passes the modal heading context through (%s)",
  async ({ render, components: { Modal, LayoutCard, Heading, Content } }) => {
    await render(
      <Modal isDefaultOpen>
        <LayoutCard>
          <Heading>Heading</Heading>
        </LayoutCard>
        <Content>Content</Content>
      </Modal>,
    );

    await expect
      .element(page.getByRole("dialog").getByRole("button"))
      .toBeVisible();
  },
);
