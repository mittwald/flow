import { testEnvironments } from "@/tests/lib/environments";
import { expect, test, vi } from "vitest";
import { userEvent, page } from "vitest/browser";

test.each(testEnvironments)(
  "DatePicker states (%s)",
  async ({
    container,
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

    await expect(container).toMatchScreenshot("DatePicker states");
  },
);

test.each(testEnvironments)(
  "DatePicker interaction (%s)",
  async ({ container, render, components: { DatePicker, Label } }) => {
    await render(
      <DatePicker>
        <Label>Label</Label>
      </DatePicker>,
    );

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-09-01T11:00:00Z"));

    const button = page.getByLocator("button");

    await expect(container).toMatchScreenshot("DatePicker - default");

    await button.click();

    await expect(container).toMatchScreenshot("DatePicker - calendar visible");

    await userEvent.keyboard("{enter}");

    await expect(container).toMatchScreenshot("DatePicker - date selected");
  },
);
