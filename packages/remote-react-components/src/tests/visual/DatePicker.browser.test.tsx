import { testEnvironments } from "@/tests/lib/environments";
import { rootContainerLocator } from "@/tests/lib/RootContainer";
import { expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

/**
 * Whether the focus sits in the scenario at all — the field's ring is pure CSS
 * (`:focus-within` on the form control, `:focus` on the segment), so this is
 * exactly what the reference encodes. The calendar renders in a portal outside
 * the container, so an open one reads as `false`.
 */
const focusIsInTheScenario = () =>
  rootContainerLocator.element().contains(document.activeElement);

test.each(testEnvironments)(
  "DatePicker states (%s)",
  async ({
    testScreenshot,
    render,
    components: { Flex, DatePicker, Label, FieldError, FieldDescription },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <DatePicker>
          <Label>Default</Label>
          <FieldDescription>FieldDescription</FieldDescription>
        </DatePicker>
        <DatePicker isInvalid>
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </DatePicker>
        <DatePicker isReadOnly>
          <Label>Readonly</Label>
        </DatePicker>
        <DatePicker isDisabled>
          <Label>Disabled</Label>
          <FieldDescription>FieldDescription</FieldDescription>
        </DatePicker>
      </Flex>,
    );

    await testScreenshot("DatePicker states");
  },
);

test.each(testEnvironments)(
  "DatePicker interaction (%s)",
  async ({ testScreenshot, render, components: { DatePicker, Label } }) => {
    await render(
      <DatePicker>
        <Label>Label</Label>
      </DatePicker>,
    );

    vi.setSystemTime(new Date("2025-09-01T11:00:00Z"));

    const button = page.getByLocator("button");

    await testScreenshot("DatePicker - default");

    await button.click();

    await testScreenshot("DatePicker - calendar visible");

    await userEvent.keyboard("{enter}");

    /*
     * Enter closes the calendar, and react-aria restores the focus to the
     * field's first segment as the popover unmounts. Tab pressed into that
     * window is undone by the restore that lands after it: the focus ends up
     * back on the segment, and the capture shows a focused field where the
     * reference has none — a ~1% diff, in whichever environment lost the race
     * (they share one reference).
     *
     * The screenshot preamble cannot cover this. A focus move is a CSS
     * pseudo-class change, not a mutation its settle can observe, and the
     * restore arrives after the quiet window either way. So wait for the field
     * to have the focus back before handing it on.
     */
    await expect.poll(focusIsInTheScenario).toBe(true);

    await userEvent.keyboard("{tab}");

    // ... and for Tab to have taken it out again, which is the state captured.
    await expect.poll(focusIsInTheScenario).toBe(false);

    await testScreenshot("DatePicker - date selected");
  },
);
