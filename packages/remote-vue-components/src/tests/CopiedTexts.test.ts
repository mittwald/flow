import { texts as listTexts } from "@/list/locales";
import { confirmCloseTexts, lightBoxCloseTexts } from "@/overlays/locales";
import lightBoxDe from "../../../components/src/components/LightBox/locales/de-DE.locale.json";
import lightBoxEn from "../../../components/src/components/LightBox/locales/en-US.locale.json";
import listDe from "../../../components/src/components/List/locales/de-DE.locale.json";
import listEn from "../../../components/src/components/List/locales/en-US.locale.json";
import modalDe from "../../../components/src/components/Modal/locales/de-DE.locale.json";
import modalEn from "../../../components/src/components/Modal/locales/en-US.locale.json";
import { describe, expect, test } from "vitest";

/*
 * This binding carries copies of Flow's UI strings, because Flow compiles them
 * into the React bundle and publishes no entry point for them. A rewording on
 * the Flow side would otherwise reach React and leave Vue on the old text,
 * with nothing failing.
 */

type Locale = "de-DE" | "en-US";

const flow = {
  list: { "de-DE": listDe, "en-US": listEn },
  modal: { "de-DE": modalDe, "en-US": modalEn },
  lightBox: { "de-DE": lightBoxDe, "en-US": lightBoxEn },
} satisfies Record<string, Record<Locale, Record<string, string>>>;

const locales: Locale[] = ["de-DE", "en-US"];

/**
 * Flow's `results.show` is one ICU `select` on the count; the binding splits it
 * into a key per branch (see `src/list/locales.ts`).
 */
const splitResultsShow = (icu: string) => {
  const match = /^(.*)\{\w+, select, 1 \{(.*?)\} other \{(.*)\}\}(.*)$/.exec(
    icu,
  );

  if (!match) {
    throw new Error(`results.show is no longer the expected select: ${icu}`);
  }

  const [, before, one, other, after] = match;

  return {
    "results.show.one": `${before}${one}${after}`,
    "results.show.other": `${before}${other}${after}`,
  };
};

describe.each(locales)("the texts copied from Flow (%s)", (locale) => {
  test("List", () => {
    const flowTexts: Record<string, string> = flow.list[locale];
    const copied: Record<string, string> = listTexts[locale];

    const expected = {
      ...Object.fromEntries(
        Object.keys(copied)
          .filter((key) => !key.startsWith("results.show."))
          .map((key) => [key, flowTexts[key]]),
      ),
      ...splitResultsShow(flowTexts["results.show"] ?? ""),
    };

    expect(copied).toEqual(expected);
  });

  test("Modal confirmOnClose", () => {
    const modal = flow.modal[locale];

    expect(confirmCloseTexts[locale]).toEqual({
      heading: modal["unsavedChangesConfirmationModal.heading"],
      text: modal["unsavedChangesConfirmationModal.text"],
      close: modal["unsavedChangesConfirmationModal.close"],
      keepOpen: modal["unsavedChangesConfirmationModal.keepOpen"],
    });
    /* The same string labels the modal's own close button. */
    expect(confirmCloseTexts[locale].close).toBe(modal.close);
  });

  test("LightBox close label", () => {
    expect(lightBoxCloseTexts[locale]).toBe(flow.lightBox[locale].close);
  });
});
