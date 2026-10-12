import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { expect, test } from "vitest";
import { Autocomplete } from "@/components/Autocomplete";
import { SearchField } from "@/components/SearchField";
import { Option } from "@/components/Option";
import { Label } from "@/components/Label";

const input = () => page.getByRole("searchbox");
const suggestions = () => page.getByRole("listbox");
const suggestion = (name: string) => page.getByRole("option", { name });

const renderAutocomplete = () =>
  render(
    <Autocomplete>
      <SearchField>
        <Label>Comlink address</Label>
      </SearchField>
      <Option>leia@rebellion.org</Option>
      <Option>han@rebellion.org</Option>
      <Option>vader@empire.gov</Option>
    </Autocomplete>,
  );

/*
 * The suggestions only exist while something is typed: an empty field closes
 * them again, which is what keeps the list out of the way on first focus.
 */
test("typing opens the suggestions and emptying the field closes them", async () => {
  renderAutocomplete();

  await expect.element(suggestions()).not.toBeInTheDocument();

  await userEvent.fill(input(), "rebellion");

  await expect.element(suggestions()).toBeVisible();

  await userEvent.fill(input(), "");

  await expect.element(suggestions()).not.toBeInTheDocument();
});

test("the suggestions are filtered by what is typed", async () => {
  renderAutocomplete();

  await userEvent.fill(input(), "rebellion");

  await expect.element(suggestion("leia@rebellion.org")).toBeVisible();
  await expect.element(suggestion("han@rebellion.org")).toBeVisible();
  await expect.element(suggestion("vader@empire.gov")).not.toBeInTheDocument();
});

// The filter ignores case and accents.
test("the filter ignores case", async () => {
  renderAutocomplete();

  await userEvent.fill(input(), "LEIA");

  await expect.element(suggestion("leia@rebellion.org")).toBeVisible();
});

test("picking a suggestion writes it into the field and closes the list", async () => {
  renderAutocomplete();

  await userEvent.fill(input(), "rebellion");
  await suggestion("han@rebellion.org").click();

  await expect.element(input()).toHaveValue("han@rebellion.org");
  await expect.element(suggestions()).not.toBeInTheDocument();
});

test("a search without matches says so", async () => {
  renderAutocomplete();

  await userEvent.fill(input(), "mandalore");

  await expect.element(page.getByText("No matching entries")).toBeVisible();
});
