import { Linter } from "eslint";
import tseslint from "typescript-eslint";
import { describe, expect, test } from "vitest";
import rule from "./noBrandColorVariable.mjs";

const linter = new Linter({ configType: "flat" });

const lint = (code: string) =>
  linter.verify(
    code,
    {
      files: ["**/*.tsx"],
      languageOptions: {
        parser: tseslint.parser as Linter.Parser,
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      plugins: { flow: { rules: { "no-brand-color-variable": rule } } },
      rules: { "flow/no-brand-color-variable": "error" },
    },
    "Example.tsx",
  );

const rejected = (code: string) => lint(code).map((m) => m.message);

describe("flow/no-brand-color-variable", () => {
  describe("accepts", () => {
    test("Semantic, Variant and component variables", () => {
      expect(
        lint(
          'const s = { color: "var(--primary--color--1000)", background: "var(--primary-solid-background-color)" };',
        ),
      ).toEqual([]);
    });

    test("a runtime-built Semantic variable", () => {
      expect(lint("const c = `var(--categorical--color--${color})`;")).toEqual(
        [],
      );
    });

    test("a component token that ends in a Brand-like name", () => {
      expect(lint('const c = "var(--label--color--default)";')).toEqual([]);
    });

    test("a --color-- name that is no Brand group", () => {
      expect(lint('const c = "var(--color--accent)";')).toEqual([]);
    });
  });

  describe("rejects", () => {
    test("a Brand variable", () => {
      const [message, ...rest] = lint(
        'const c = "var(--color--mittwald-blue--1000)";',
      );

      expect(rest).toEqual([]);
      expect(message?.ruleId).toBe("flow/no-brand-color-variable");
      expect(message?.message).toContain(
        'Unexpected Brand CSS variable "--color--mittwald-blue--1000"',
      );
    });

    test("a Brand variable in a style attribute", () => {
      const [message] = rejected(
        '<div style={{ color: "var(--color--mittwald-neutral--700)" }} />;',
      );

      expect(message).toContain("--color--mittwald-neutral--700");
    });

    test("a Brand variable set as a custom property", () => {
      const [message] = rejected(
        'el.style.setProperty("--color--mittwald-blue--1000", "red");',
      );

      expect(message).toContain("--color--mittwald-blue--1000");
    });

    test("a step completed at runtime", () => {
      const [message] = rejected(
        "const c = `var(--color--mittwald-blue--${step})`;",
      );

      expect(message).toContain(
        'Unexpected Brand CSS variable "--color--mittwald-blue--"',
      );
    });

    test("a group completed at runtime", () => {
      const [message] = rejected("const c = `var(--color--${hue}--100)`;");

      expect(message).toContain('Unexpected "--color--" completed at runtime');
    });

    test("a name completed by concatenation", () => {
      expect(
        rejected('const c = "var(--color--mittwald-green--" + step + ")";'),
      ).toEqual([expect.stringContaining('"--color--mittwald-green--"')]);
      expect(rejected('const c = "var(--color--" + hue + "--100)";')).toEqual([
        expect.stringContaining('Unexpected "--color--" completed at runtime'),
      ]);
    });
  });
});
