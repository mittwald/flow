import { testEnvironments } from "@/tests/lib/environments";
import {
  waitForFocusInTheScenario,
  waitForFocusOutsideTheScenario,
} from "@/tests/lib/scenarioFocus";
import { test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

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
     * window is undone by the restore landing after it: the focus ends up back
     * on the segment, and the capture shows a focused field where the reference
     * has none. So wait for the restore first — see `@/tests/lib/scenarioFocus`
     * for why the screenshot preamble cannot cover this.
     */
    await waitForFocusInTheScenario();

    await userEvent.keyboard("{tab}");

    // ... and then for Tab to have taken it out again, the state captured below.
    await waitForFocusOutsideTheScenario();

    await testScreenshot("DatePicker - date selected");
  },
);
