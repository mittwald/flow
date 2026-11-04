import type { ReactNode } from "react";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { describe, expect, test, vi } from "vitest";
import {
  TranslationProvider,
  type Translations,
} from "@/components/TranslationProvider";
import { SearchField } from "@/components/SearchField";
import { Label } from "@/components/Label";
import { Notification } from "@/components/Notification";
import { Text } from "@/components/Text";
import { ProgressBar } from "@/components/ProgressBar";
import { Autocomplete } from "@/components/Autocomplete";
import { Option } from "@/components/Option";
import {
  LightBox,
  LightBoxGallery,
  LightBoxGalleryItem,
} from "@/components/LightBox";
import LightBoxTrigger from "@/components/LightBox/components/LightBoxTrigger";
import { Button } from "@/components/Button";

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

describe("a translation reaches the built-in text of", () => {
  const renderTranslated = (translations: Translations, children: ReactNode) =>
    render(
      <TranslationProvider translations={translations}>
        {children}
      </TranslationProvider>,
    );

  test("Notification", async () => {
    renderTranslated(
      { "en-US": { Notification: { "notification.close": "Dismiss" } } },
      <Notification onClose={() => undefined}>
        <Text>Saved</Text>
      </Notification>,
    );

    await expect
      .element(page.getByRole("button", { name: "Dismiss" }))
      .toBeVisible();
  });

  test("ProgressBar", async () => {
    renderTranslated(
      { "en-US": { ProgressBar: { "progressBar.of": "out of" } } },
      <ProgressBar
        aria-label="Storage"
        value={40}
        maxValue={80}
        showMaxValue
      />,
    );

    await expect
      .element(page.getByRole("progressbar"))
      .toHaveTextContent("40% out of 80%");
  });

  test("Autocomplete", async () => {
    renderTranslated(
      { "en-US": { Autocomplete: { "autocomplete.empty": "Nothing found" } } },
      <Autocomplete>
        <SearchField>
          <Label>Comlink address</Label>
        </SearchField>
        <Option>leia@rebellion.org</Option>
      </Autocomplete>,
    );

    await userEvent.fill(page.getByRole("searchbox"), "mandalore");

    await expect.element(page.getByText("Nothing found")).toBeVisible();
  });

  test("LightBox", async () => {
    renderTranslated(
      { "en-US": { LightBox: { close: "Close picture" } } },
      <LightBoxTrigger>
        <Button>Open</Button>
        <LightBox>
          <Text>A picture of a starship</Text>
        </LightBox>
      </LightBoxTrigger>,
    );

    await page.getByRole("button", { name: "Open" }).click();

    await expect
      .element(page.getByRole("button", { name: "Close picture" }))
      .toBeVisible();
  });

  test("LightBoxGallery", async () => {
    renderTranslated(
      {
        "en-US": {
          LightBox: {
            previous: "Back",
            next: "Forward",
            gallery: "Photos",
            carousel: "slideshow",
          },
        },
      },
      <LightBoxGallery>
        <Text>Starship</Text>
        <Text>Freighter</Text>
      </LightBoxGallery>,
    );

    await expect
      .element(page.getByRole("region", { name: "Photos" }))
      .toHaveAttribute("aria-roledescription", "slideshow");
    await expect
      .element(page.getByRole("button", { name: "Back" }))
      .toBeVisible();
    await expect
      .element(page.getByRole("button", { name: "Forward" }))
      .toBeVisible();
  });

  test("LightBoxGalleryItem", async () => {
    renderTranslated(
      { "en-US": { LightBox: { close: "Dismiss" } } },
      <LightBoxGalleryItem>
        <Text>Starship</Text>
      </LightBoxGalleryItem>,
    );

    await expect
      .element(page.getByRole("button", { name: "Dismiss" }))
      .toBeVisible();
  });
});
