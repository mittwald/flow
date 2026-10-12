import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { expect, test, vi } from "vitest";
import { TranslationProvider } from "@/components/TranslationProvider";
import { SearchField } from "@/components/SearchField";
import { Label } from "@/components/Label";

const searchBox = () => page.getByRole("searchbox");

const field = (
  <SearchField>
    <Label>Domain</Label>
  </SearchField>
);

test("without a provider the built-in text is used", async () => {
  render(field);

  await expect.element(searchBox()).toHaveAttribute("placeholder", "Search");
});

test("a translation for the locale replaces the built-in text", async () => {
  render(
    <TranslationProvider
      translations={{ "en-US": { SearchField: { search: "Find" } } }}
    >
      {field}
    </TranslationProvider>,
  );

  await expect.element(searchBox()).toHaveAttribute("placeholder", "Find");
});

test("a translation for another locale is left alone", async () => {
  render(
    <TranslationProvider
      translations={{ "de-DE": { SearchField: { search: "Suchen" } } }}
    >
      {field}
    </TranslationProvider>,
  );

  await expect.element(searchBox()).toHaveAttribute("placeholder", "Search");
});

/*
 * The `translate` callback wins over everything and is asked for every key, so
 * an application can route Flow's text through its own i18n stack.
 */
test("the translate callback answers with the component and the locale", async () => {
  const translate = vi.fn(() => "From the app");

  render(
    <TranslationProvider translate={translate}>{field}</TranslationProvider>,
  );

  await expect
    .element(searchBox())
    .toHaveAttribute("placeholder", "From the app");

  expect(translate).toHaveBeenCalledWith(
    "search",
    undefined,
    expect.objectContaining({ component: "SearchField", locale: "en-US" }),
  );
});

test("a translate callback that answers undefined falls back to the built-in text", async () => {
  render(
    <TranslationProvider translate={() => undefined}>
      {field}
    </TranslationProvider>,
  );

  await expect.element(searchBox()).toHaveAttribute("placeholder", "Search");
});
