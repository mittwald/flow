import { render } from "vitest-browser-react";
import { List, ListFilter, ListItem, ListStaticData } from "@/components/List";
import type { DateRangeFilterOptions } from "@/components/List";
import { expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { CalendarDate } from "@internationalized/date";
import { I18nProvider } from "react-aria-components";

interface Entry {
  id: string;
  date: string;
}

const entries: Entry[] = [
  { id: "early", date: "2026-10-01T07:30:00" },
  { id: "morning", date: "2026-10-01T09:00:00" },
  { id: "noon", date: "2026-10-01T12:00:30" },
  { id: "evening", date: "2026-10-01T20:00:00" },
  { id: "nextDay", date: "2026-10-02T10:00:00" },
];

const list = (
  dateRangeOptions: DateRangeFilterOptions = { granularity: "minute" },
  priority?: "primary" | "secondary",
) => (
  <List aria-label="Entries">
    <ListStaticData<Entry> data={entries} />
    <ListFilter<Entry>
      property="date"
      mode="dateRange"
      name="Date"
      priority={priority}
      dateRangeOptions={dateRangeOptions}
    />
    <ListItem<Entry> textValue={(e) => e.id}>
      {({ id }) => <span>Entry: {id}</span>}
    </ListItem>
  </List>
);

const renderList = (...args: Parameters<typeof list>) => render(list(...args));

const field = (name: string) => page.getByRole("group", { name });

const enter = async (name: string, keys: string) => {
  await userEvent.click(field(name).getByRole("spinbutton").first());
  await userEvent.keyboard(keys);
};

const expectEntries = async (...ids: string[]) => {
  for (const { id } of entries) {
    const entry = page.getByText(`Entry: ${id}`, { exact: true });
    if (ids.includes(id)) {
      await expect.element(entry).toBeInTheDocument();
    } else {
      await expect.element(entry).not.toBeInTheDocument();
    }
  }
};

const openFilter = () =>
  userEvent.click(page.getByRole("button", { name: "Date" }));

test("filters by date and time as the fields change", async () => {
  await renderList();
  await openFilter();

  await enter("Start date", "10012026");
  await expectEntries("early", "morning", "noon", "evening", "nextDay");

  await enter("Start time", "0800");
  await enter("End date", "10012026");
  await enter("End time", "1200");

  await expectEntries("morning", "noon");
  await expect.element(field("End time")).toBeVisible();
});

test("treats a date without time as the whole day", async () => {
  await renderList();
  await openFilter();

  await enter("End date", "10012026");

  await expectEntries("early", "morning", "noon", "evening");
});

test("ignores a time without a date", async () => {
  await renderList();
  await openFilter();

  await enter("Start time", "0800");

  await expectEntries("early", "morning", "noon", "evening", "nextDay");
});

const rangeError = () =>
  page.getByText("The end must not be before the start.");

test("keeps the last valid range while the end is before the start", async () => {
  await renderList();
  await openFilter();

  await enter("Start date", "10012026");
  await enter("Start time", "1200");
  await enter("End date", "10012026");
  await expectEntries("noon", "evening");

  await enter("End time", "0800");

  await expect.element(rangeError()).toBeVisible();
  await expect
    .element(field("End time"))
    .toHaveAccessibleDescription(/The end must not be before the start\./);
  await expectEntries("noon", "evening");
});

test("shows the range error whichever field is filled first", async () => {
  await renderList();
  await openFilter();

  await enter("End date", "10012026");
  await enter("Start date", "10022026");

  await expect.element(rangeError()).toBeVisible();
  await expectEntries("early", "morning", "noon", "evening");

  await enter("Start date", "09302026");

  await expect.element(rangeError()).not.toBeInTheDocument();
});

test("shows an error while a date is out of range", async () => {
  await renderList({
    granularity: "minute",
    maxValue: new CalendarDate(2026, 10, 2),
  });
  await openFilter();

  await enter("End date", "10052026");
  await userEvent.keyboard("{Tab}");

  await expect.element(page.getByText(/or earlier/)).toBeVisible();
  await expectEntries("early", "morning", "noon", "evening", "nextDay");
});

test("keeps the popover width while typing", async () => {
  // In de-DE a typed date is wider than its placeholder
  await render(<I18nProvider locale="de-DE">{list()}</I18nProvider>);
  await openFilter();

  const popover = page.getByRole("dialog").element();
  const initialWidth = popover.getBoundingClientRect().width;

  await enter("Startdatum", "28122025");
  await enter("Startzeit", "2359");

  expect(popover.getBoundingClientRect().width).toBe(initialWidth);
});

test("shows the range with time in the active filter", async () => {
  await renderList();
  await openFilter();

  await enter("Start date", "10012026");
  await enter("Start time", "0800");
  await userEvent.keyboard("{Escape}");

  await expect
    // WebKit joins date and time with "at"
    .element(page.getByText(/^from Oct 1, 2026(,| at) 08:00$/))
    .toBeInTheDocument();
});

test("clears the fields when the active filter is removed", async () => {
  await renderList();
  await openFilter();
  await enter("Start date", "10012026");
  await enter("Start time", "1000");
  await userEvent.keyboard("{Escape}");

  await userEvent.click(page.getByRole("button", { name: "Remove" }));
  await expectEntries("early", "morning", "noon", "evening", "nextDay");

  await openFilter();
  await expect
    .element(field("Start date").getByRole("spinbutton").first())
    .toHaveTextContent("mm");
});

test("offers the fields in the all filters modal", async () => {
  await renderList({ granularity: "minute" }, "secondary");
  await userEvent.click(page.getByRole("button", { name: "All filters" }));

  await enter("Start date", "10012026");
  await enter("Start time", "1900");

  await expectEntries("evening", "nextDay");
});

test("keeps the range calendar without granularity", async () => {
  await renderList({});
  await openFilter();

  await expect.element(page.getByRole("grid").first()).toBeVisible();
  await expect.element(field("Start time")).not.toBeInTheDocument();
});
