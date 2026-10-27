import { readFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import { globSync } from "glob";
import { describe, expect, test } from "vitest";
import { relativeToSrc, srcDir } from "./remoteSurface";

/** The languages every `locales/` directory in the package has to cover. */
const requiredLanguages = ["de-DE", "en-US"];

const localeFiles = globSync("**/locales/*.locale.json", {
  cwd: srcDir,
  absolute: true,
});

const localeDirectories = [...new Set(localeFiles.map(dirname))].sort();

const languageOf = (file: string): string =>
  basename(file, ".locale.json").replace(/\.\w+$/, "");

/** Flat, dotted key paths — the strings a component actually looks up. */
const messageKeys = (value: unknown, prefix = ""): string[] =>
  typeof value === "object" && value !== null
    ? Object.entries(value).flatMap(([key, nested]) =>
        messageKeys(nested, `${prefix}${key}.`),
      )
    : [prefix.slice(0, -1)];

describe.each(localeDirectories)("%s", (directory) => {
  const filesHere = localeFiles.filter((file) => dirname(file) === directory);
  const languages = filesHere.map(languageOf);

  test("covers every language", () => {
    /*
     * A new language is welcome — but half a language is not: a missing file
     * falls back to whatever the formatter finds, so the component renders
     * another language's text instead of failing.
     */
    expect(
      requiredLanguages.filter((language) => !languages.includes(language)),
      `${relativeToSrc(directory)} is missing a locale file. Every locales/ directory in the package carries all of ${requiredLanguages.join(", ")}.`,
    ).toStrictEqual([]);
  });

  test("defines the same keys in every language", () => {
    const keysPerLanguage = Object.fromEntries(
      filesHere.map((file) => [
        languageOf(file),
        messageKeys(JSON.parse(readFileSync(file, "utf8"))),
      ]),
    );

    const allKeys = [
      ...new Set(Object.values(keysPerLanguage).flat()),
    ].toSorted();

    /*
     * ICU falls back per key, not per file, so a key present in one language
     * and absent in another renders that one string in the wrong language —
     * mid-sentence, with nothing logged.
     */
    const missing = Object.entries(keysPerLanguage).flatMap(
      ([language, keys]) =>
        allKeys
          .filter((key) => !keys.includes(key))
          .map((k) => `${language}: ${k}`),
    );

    expect(
      missing,
      `${relativeToSrc(directory)} does not define the same keys in every language.`,
    ).toStrictEqual([]);
  });
});
