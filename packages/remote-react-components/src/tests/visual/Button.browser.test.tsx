import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "Button states (%s)",
  async ({ container, render, components: { Flex, Button } }) => {
    await render(
      <Flex gap="s">
        <Button>Default</Button>
        <Button isDisabled>Disabled</Button>
        <Button data-testid="hover">Hover</Button>
        <Button>Focus</Button>
      </Flex>,
    );

    const hoverButton = page.getByTestId("hover");
    await hoverButton.hover();

    // tab to focus the last button
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    await expect(container).toMatchScreenshot("Button states - default");
  },
);
