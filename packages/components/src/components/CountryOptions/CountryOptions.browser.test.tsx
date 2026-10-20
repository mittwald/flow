import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test } from "vitest";
import { CountryOptions, sortByDachFirst } from "@/components/CountryOptions";
import { Select } from "@/components/Select";
import { Label } from "@/components/Label";

const toggle = () => page.getByRole("button", { name: /Country/ });

const optionNames = () =>
  Array.from(document.querySelectorAll("[role='option']")).map(
    (option) => option.textContent,
  );

const select = (children: React.ReactNode) => (
  <Select>
    <Label>Country</Label>
    {children}
  </Select>
);

const renderOptions = async (children: React.ReactNode) => {
  const screen = await render(select(children));

  await toggle().click();
  await expect.element(page.getByRole("listbox")).toBeVisible();

  return screen;
};

test("the countries are listed under their localized name, sorted", async () => {
  await renderOptions(<CountryOptions />);

  const names = optionNames();

  expect(names).toContain("Germany");
  expect(names).toContain("Austria");
  expect(names.length).toBeGreaterThan(200);
  expect([...names].sort((a, b) => (a ?? "").localeCompare(b ?? ""))).toEqual(
    names,
  );
});

test("filterBy narrows the list", async () => {
  await renderOptions(
    <CountryOptions filterBy={(country) => country.code === "DE"} />,
  );

  expect(optionNames()).toEqual(["Germany"]);
});

/*
 * The DACH sort is what most mittwald forms want: the three German-speaking
 * countries first, in that order, everything else alphabetical behind them.
 */
test("sortByDachFirst puts Germany, Austria and Switzerland in front", async () => {
  await renderOptions(<CountryOptions sortBy={sortByDachFirst} />);

  expect(optionNames().slice(0, 3)).toEqual([
    "Germany",
    "Austria",
    "Switzerland",
  ]);
});

test("the option value is the country code, not the name", async () => {
  await renderOptions(
    <CountryOptions filterBy={(country) => country.code === "DE"} />,
  );

  expect(
    document.querySelector("[role='option']")?.getAttribute("data-key"),
  ).toBe("DE");
});

test("changing filterBy after mount updates the list", async () => {
  const { rerender } = await renderOptions(
    <CountryOptions filterBy={(country) => country.code === "DE"} />,
  );
  expect(optionNames()).toEqual(["Germany"]);

  await rerender(
    select(<CountryOptions filterBy={(country) => country.code === "AT"} />),
  );

  await expect.poll(optionNames).toEqual(["Austria"]);
});
