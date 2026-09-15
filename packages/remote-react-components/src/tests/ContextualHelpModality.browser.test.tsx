import { testEnvironments } from "@/tests/lib/environments";
import { expect, test } from "vitest";
import { page } from "vitest/browser";

/*
 * `modality` decides whether the popover takes the page hostage. It has to
 * arrive on the host to do that — the host is where react-aria locks scrolling,
 * so a prop that gets dropped on the way looks exactly like a working modal.
 */
test.each(testEnvironments)(
  "a non-modal contextual help leaves the page scrollable (%s)",
  async ({
    render,
    components: { Button, ContextualHelp, ContextualHelpTrigger, Text },
  }) => {
    await render(
      <ContextualHelpTrigger>
        <Button data-testid="trigger" />
        <ContextualHelp modality="non-modal">
          <Text>The Death Star is fully operational.</Text>
        </ContextualHelp>
      </ContextualHelpTrigger>,
    );

    await page.getByTestId("trigger").click();

    // The popover is portalled to the body. Query the host render directly –
    // in the Remote environment the hidden remote DOM holds the same text.
    await expect
      .poll(
        () =>
          document.querySelector("[class*='flow--popover--content']")
            ?.textContent,
      )
      .toBe("The Death Star is fully operational.");
    expect(document.documentElement.style.overflow).toBe("");
  },
);
