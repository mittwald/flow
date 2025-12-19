import { testEnvironments } from "@/tests/lib/environments";
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

    await testScreenshot("DatePicker - date selected");
  },
);
