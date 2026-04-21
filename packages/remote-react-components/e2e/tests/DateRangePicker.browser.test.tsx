import { renderRemoteTest } from "./renderRemoteTest";
import { expect, test } from "vitest";
import { userEvent, page } from "@vitest/browser/context";

test("DateRangePicker is rendered", async () => {
  await renderRemoteTest("standard");

  const element = page.getByTestId("element");
  await expect.element(element).toBeInTheDocument();
});

test("DateRangePicker with value is rendered", async () => {
  await renderRemoteTest("withValue");

  const element = page.getByTestId("element");
  await expect.element(element).toBeInTheDocument();

  const content = element.element().textContent;
  expect(["1.1.2025–2.1.2025"]).toContain(content);
});

test("DateRangePicker with presets", async () => {
  await renderRemoteTest("withPresets");

  const calendarButton = page.getByRole("button", { name: "Kalender" });
  await userEvent.click(calendarButton);

  const todayPresetMenuItem = page.getByRole("menuitem", { name: "Heute" });
  await userEvent.click(todayPresetMenuItem);

  const element = page.getByTestId("element");
  const content = element.element().textContent;
  expect(["21.4.2026–21.4.2026"]).toContain(content);
});

test("DateRangePicker with customPresets", async () => {
  await renderRemoteTest("withCustomPresets");

  const calendarButton = page.getByRole("button", { name: "Kalender" });
  await userEvent.click(calendarButton);

  const todayPresetMenuItem = page.getByRole("menuitem", {
    name: "Custom Preset",
  });
  await userEvent.click(todayPresetMenuItem);

  const element = page.getByTestId("element");
  const content = element.element().textContent;
  expect(["2.1.2026–4.3.2027"]).toContain(content);
});
