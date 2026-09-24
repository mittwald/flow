import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { createRef } from "react";
import { Time } from "@internationalized/date";
import { TimeField } from "@/components/TimeField";
import { Label } from "@/components/Label";

const segment = (name: string) => page.getByRole("spinbutton", { name });

test("typing into the segments reports the time", async () => {
  const onChange = vi.fn();

  render(
    <TimeField onChange={onChange}>
      <Label>Departure</Label>
    </TimeField>,
  );

  await segment("hour").click();
  await userEvent.keyboard("0930");

  await expect.element(segment("hour")).toHaveTextContent("09");
  await expect.element(segment("minute")).toHaveTextContent("30");
  expect(onChange.mock.lastCall?.[0]).toMatchObject({ hour: 9, minute: 30 });
});

/*
 * The field pins `hourCycle` to 24 before it spreads the caller's props – the
 * default has no AM/PM segment and takes an hour past noon as it is typed.
 */
test("the time is 24-hour by default", async () => {
  render(
    <TimeField>
      <Label>Departure</Label>
    </TimeField>,
  );

  await expect.element(segment("AM/PM")).not.toBeInTheDocument();

  await segment("hour").click();
  await userEvent.keyboard("13");

  await expect.element(segment("hour")).toHaveTextContent("13");
});

test("a caller's hourCycle wins over the 24-hour default", async () => {
  render(
    <TimeField hourCycle={12} defaultValue={new Time(13, 0)}>
      <Label>Departure</Label>
    </TimeField>,
  );

  // The 12-hour cycle drops the leading zero the 24-hour one keeps.
  await expect.element(segment("hour")).toHaveTextContent("1");
  await expect.element(segment("AM/PM")).toHaveTextContent("PM");
});

test("defaultValue fills the segments", async () => {
  render(
    <TimeField defaultValue={new Time(7, 5)}>
      <Label>Departure</Label>
    </TimeField>,
  );

  await expect.element(segment("hour")).toHaveTextContent("07");
  await expect.element(segment("minute")).toHaveTextContent("05");
});

/*
 * `DateInput` hands the field's ref to the first non-literal segment, so
 * focusing the field lands on the hour rather than on the wrapping group.
 */
test("the field ref focuses the first segment", async () => {
  const ref = createRef<HTMLSpanElement>();

  await render(
    <TimeField ref={ref} defaultValue={new Time(7, 5)}>
      <Label>Departure</Label>
    </TimeField>,
  );

  expect(ref.current).not.toBeNull();
  ref.current?.focus();

  await expect.element(segment("hour")).toHaveFocus();
});

test("a read-only field keeps its value", async () => {
  const onChange = vi.fn();

  render(
    <TimeField isReadOnly defaultValue={new Time(7, 5)} onChange={onChange}>
      <Label>Departure</Label>
    </TimeField>,
  );

  await segment("hour").click();
  await userEvent.keyboard("09");

  await expect.element(segment("hour")).toHaveTextContent("07");
  expect(onChange).not.toHaveBeenCalled();
});
