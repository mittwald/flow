import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";
import { DateRangePicker } from "@/components/DateRangePicker";
import { Label } from "@/components/Label";
import type { DateRangePresets } from "@/components/Calendar";

const calendarButton = () => page.getByRole("button", { name: "Calendar" });
const calendar = () => page.getByRole("application");
const day = (label: RegExp) => page.getByRole("button", { name: label });
const preset = (name: string) => page.getByRole("menuitem", { name });

const march = (day: number) => new CalendarDate(2025, 3, day);

const renderPicker = (props?: {
  defaultValue?: { start: CalendarDate; end: CalendarDate };
  withDatePickerPresets?: boolean | DateRangePresets;
  minValue?: CalendarDate;
  isDisabled?: boolean;
  onChange?: (value: unknown) => void;
}) =>
  render(
    <DateRangePicker {...props}>
      <Label>Booking</Label>
    </DateRangePicker>,
  );

/*
 * Flow routes the calendar through an overlay controller and closes it as soon
 * as a range is complete – a half-picked range has to leave it open.
 */
test("picking a start and an end reports the range and closes the calendar", async () => {
  const onChange = vi.fn();
  renderPicker({
    defaultValue: { start: march(10), end: march(12) },
    onChange,
  });

  await calendarButton().click();
  await expect.element(calendar()).toBeVisible();

  await day(/March 3, 2025/).click();

  expect(onChange).not.toHaveBeenCalled();
  await expect.element(calendar()).toBeVisible();

  await day(/March 6, 2025/).click();

  expect(onChange.mock.lastCall?.[0]).toMatchObject({
    start: { year: 2025, month: 3, day: 3 },
    end: { year: 2025, month: 3, day: 6 },
  });
  await expect.element(calendar()).not.toBeInTheDocument();
});

test("the calendar offers no presets by default", async () => {
  renderPicker();

  await calendarButton().click();
  await expect.element(calendar()).toBeVisible();

  await expect.element(page.getByRole("menu")).not.toBeInTheDocument();
});

test("a preset sets the whole range in one click and closes the calendar", async () => {
  const onChange = vi.fn();
  renderPicker({ withDatePickerPresets: true, onChange });

  await calendarButton().click();
  await preset("Today").click();

  const now = today(getLocalTimeZone());

  expect(onChange.mock.lastCall?.[0]).toMatchObject({
    start: { year: now.year, month: now.month, day: now.day },
    end: { year: now.year, month: now.month, day: now.day },
  });
  await expect.element(calendar()).not.toBeInTheDocument();
});

/*
 * A preset menu that grew on every layout resized the popover inside
 * react-aria's resize observer on it, which the browser reports as an error –
 * in production too, where error trackers pick it up.
 */
test("opening the calendar with presets causes no ResizeObserver loop", async () => {
  const errors: string[] = [];
  const onError = (event: ErrorEvent) => errors.push(event.message);
  window.addEventListener("error", onError);

  try {
    renderPicker({
      withDatePickerPresets: [
        { label: "First week of March", start: march(1), end: march(7) },
      ],
    });

    await calendarButton().click();
    await expect.element(preset("First week of March")).toBeVisible();

    for (let frame = 0; frame < 10; frame++) {
      await new Promise(requestAnimationFrame);
    }
  } finally {
    window.removeEventListener("error", onError);
  }

  expect(
    errors.filter((message) => message.includes("ResizeObserver")),
  ).toEqual([]);
});

test("custom presets replace the built-in ones", async () => {
  const onChange = vi.fn();
  renderPicker({
    withDatePickerPresets: [
      { label: "First week of March", start: march(1), end: march(7) },
    ],
    onChange,
  });

  await calendarButton().click();

  await expect.element(preset("Today")).not.toBeInTheDocument();

  await preset("First week of March").click();

  expect(onChange.mock.lastCall?.[0]).toMatchObject({
    start: { year: 2025, month: 3, day: 1 },
    end: { year: 2025, month: 3, day: 7 },
  });
});

/*
 * A preset outside the allowed range must not be selectable – it is clamped and
 * then disabled when clamping cannot produce a valid range.
 */
test("a preset outside minValue is disabled", async () => {
  renderPicker({
    withDatePickerPresets: [
      { label: "Too early", start: march(1), end: march(7) },
    ],
    minValue: march(20),
  });

  await calendarButton().click();

  await expect
    .element(preset("Too early"))
    .toHaveAttribute("aria-disabled", "true");
});

test("a disabled range picker does not open its calendar", async () => {
  renderPicker({ isDisabled: true });

  await expect.element(calendarButton()).toBeDisabled();

  await calendarButton().click({ force: true });

  await expect.element(calendar()).not.toBeInTheDocument();
});
