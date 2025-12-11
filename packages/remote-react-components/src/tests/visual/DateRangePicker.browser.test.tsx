import { testEnvironments } from "@/tests/lib/environments";
import { expect, test, vi } from "vitest";
import { userEvent, page } from "vitest/browser";

test.each(testEnvironments)(
  "DateRangePicker states (%s)",
  async ({
    container,
    render,
    components: { Flex, DateRangePicker, Label, FieldError, FieldDescription },
  }) => {
    await render(
      <Flex direction="column" gap="m">
        <DateRangePicker>
          <Label>Default</Label>
          <FieldDescription>FieldDescription</FieldDescription>
        </DateRangePicker>
        <DateRangePicker isInvalid>
          <Label>Invalid</Label>
          <FieldError>FieldError</FieldError>
        </DateRangePicker>
        <DateRangePicker isReadOnly>
          <Label>Readonly</Label>
        </DateRangePicker>
        <DateRangePicker isDisabled>
          <Label>Disabled</Label>
        </DateRangePicker>
      </Flex>,
    );

    await expect(container).toMatchScreenshot("DateRangePicker states");
  },
);

test.each(testEnvironments)(
  "DateRangePicker interaction (%s)",
  async ({ container, render, components: { DateRangePicker, Label } }) => {
    await render(
      <DateRangePicker>
        <Label>Label</Label>
      </DateRangePicker>,
    );

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-09-01T11:00:00Z"));

    const button = page.getByLocator("button");

    await expect(container).toMatchScreenshot("DateRangePicker - default");

    await button.click();

    await expect(container).toMatchScreenshot(
      "DateRangePicker - calendar visible",
    );

    await userEvent.keyboard("{enter}");

    await expect(container).toMatchScreenshot(
      "DateRangePicker - start date selected",
    );

    await userEvent.keyboard("{enter}");

    await expect(container).toMatchScreenshot(
      "DateRangePicker - range selected",
    );
  },
);
