import { testEnvironments } from "@/tests/lib/environments";
import { test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

test.each(testEnvironments)(
  "DateRangePicker states (%s)",
  async ({
    testScreenshot,
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

    await testScreenshot("DateRangePicker states");
  },
);

test.each(testEnvironments)(
  "DateRangePicker interaction (%s)",
  async ({
    testScreenshot,
    render,
    components: { DateRangePicker, Label },
  }) => {
    await render(
      <DateRangePicker>
        <Label>Label</Label>
      </DateRangePicker>,
    );

    vi.setSystemTime(new Date("2025-09-01T11:00:00Z"));

    const button = page.getByLocator("button");

    await testScreenshot("DateRangePicker - default");

    await button.click();
    await testScreenshot("DateRangePicker - calendar visible");

    await userEvent.keyboard("{enter}");
    await testScreenshot("DateRangePicker - start date selected");

    await userEvent.keyboard("{enter}");
    await testScreenshot("DateRangePicker - range selected");
  },
);
