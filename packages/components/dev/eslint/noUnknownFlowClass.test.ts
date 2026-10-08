import { Linter } from "eslint";
import tseslint from "typescript-eslint";
import { describe, expect, test } from "vitest";
import rule from "./noUnknownFlowClass.mjs";

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
      plugins: { flow: { rules: { "no-unknown-flow-class": rule } } },
      rules: { "flow/no-unknown-flow-class": "error" },
    },
    "Example.tsx",
  );

const rejected = (code: string) => lint(code).map((m) => m.message);

describe("flow/no-unknown-flow-class", () => {
  describe("accepts", () => {
    test("a class a component generates", () => {
      expect(lint('const c = "flow--button";')).toEqual([]);
    });

    test("a className attribute naming several classes", () => {
      expect(
        lint('<div className="flow--table--row flow--table--cell" />;'),
      ).toEqual([]);
    });

    test("a selector with a pseudo class or an attribute", () => {
      expect(
        lint(
          'document.querySelector(".flow--popover--content[data-x]:hover");',
        ),
      ).toEqual([]);
    });

    test("a prefix completed at runtime", () => {
      expect(lint('const c = "flow--button--" + color;')).toEqual([]);
      expect(lint('const c = base + " flow--button--" + color;')).toEqual([]);
      expect(lint("const c = `flow--button--${color}`;")).toEqual([]);
      expect(lint("const c = `flow--but${suffix}`;")).toEqual([]);
      expect(lint('const c = "[class*=\\"flow--\\"]";')).toEqual([]);
    });

    test("a name that merely contains flow--", () => {
      expect(lint('const c = "overflow--nope";')).toEqual([]);
    });
  });

  describe("rejects", () => {
    test("a name the generator never produces", () => {
      const [message, ...rest] = lint('const c = "flow--nonexistent";');

      expect(rest).toEqual([]);
      expect(message?.ruleId).toBe("flow/no-unknown-flow-class");
      expect(message?.message).toMatch(/no Flow component generates/);
    });

    test("a root class whose suffix was not dropped", () => {
      const [message] = rejected(
        '<div className="flow--column-layout--column-layout" />;',
      );

      expect(message).toContain('"flow--column-layout--column-layout"');
    });

    test("names the closest known class as a suggestion", () => {
      const [message] = rejected('const c = "flow--alert-icon";');

      expect(message).toContain('Did you mean "flow--alert--icon"?');
    });

    test("a prefix no known class starts with", () => {
      const [message, ...rest] = rejected("const c = `flow--buton--${color}`;");

      expect(rest).toEqual([]);
      expect(message).toContain("no Flow component generates a class starting");
      expect(message).toContain('Did you mean "flow--button--"?');
      expect(rejected('const c = "flow--nonexistent--" + size;')).toHaveLength(
        1,
      );
    });

    test("a complete name inside a template literal", () => {
      const messages = rejected("const c = `${base} flow--nope ${other}`;");

      expect(messages).toHaveLength(1);
      expect(messages[0]).toContain('"flow--nope"');
    });

    test("a complete name directly after an interpolation", () => {
      const messages = rejected("const c = `${base}flow--nope`;");

      expect(messages).toHaveLength(1);
      expect(messages[0]).toContain('"flow--nope"');
    });

    test("a name behind an escape sequence", () => {
      const messages = rejected('const c = "flow--button\\nflow--nope";');

      expect(messages).toHaveLength(1);
      expect(messages[0]).toContain('"flow--nope"');
    });

    test("every unknown class in one string", () => {
      expect(lint('const c = "flow--nope-one flow--nope-two";')).toHaveLength(
        2,
      );
    });
  });
});
