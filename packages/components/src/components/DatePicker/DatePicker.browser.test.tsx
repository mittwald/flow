import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { CalendarDate } from "@internationalized/date";
import { DatePicker } from "@/components/DatePicker";
import { Label } from "@/components/Label";

const segment = (name: string) => page.getByRole("spinbutton", { name });
const calendarButton = () => page.getByRole("button", { name: "Calendar" });
const calendar = () => page.getByRole("application");
const day = (label: RegExp) => page.getByRole("button", { name: label });

const renderPicker = (props?: {
  defaultValue?: CalendarDate;
  isDisabled?: boolean;
  onChange?: (value: unknown) => void;
}) =>
  render(
    <DatePicker {...props}>
      <Label>Departure</Label>
    </DatePicker>,
  );

test("defaultValue fills the segments", async () => {
  renderPicker({ defaultValue: new CalendarDate(2025, 3, 10) });

  await expect.element(segment("month")).toHaveTextContent("3");
  await expect.element(segment("day")).toHaveTextContent("10");
  await expect.element(segment("year")).toHaveTextContent("2025");
});

test("typing into the segments reports the date", async () => {
  const onChange = vi.fn();
  renderPicker({ onChange });

  await segment("month").click();
  await userEvent.keyboard("03102025");

  expect(onChange.mock.lastCall?.[0]).toMatchObject({
    year: 2025,
    month: 3,
    day: 10,
  });
});

/*
 * Picking a day is the one place where Flow adds its own behaviour: the picker
 * routes the calendar through an overlay controller and closes it on change.
 */
test("picking a day reports the date and closes the calendar", async () => {
  const onChange = vi.fn();
  renderPicker({ defaultValue: new CalendarDate(2025, 3, 10), onChange });

  await calendarButton().click();

  await expect.element(calendar()).toBeVisible();

  await day(/March 12, 2025/).click();

  expect(onChange.mock.lastCall?.[0]).toMatchObject({
    year: 2025,
    month: 3,
    day: 12,
  });
  await expect.element(calendar()).not.toBeInTheDocument();
  await expect.element(segment("day")).toHaveTextContent("12");
});

test("a disabled date picker does not open its calendar", async () => {
  renderPicker({ isDisabled: true });

  await expect.element(calendarButton()).toBeDisabled();

  await calendarButton().click({ force: true });

  await expect.element(calendar()).not.toBeInTheDocument();
});
