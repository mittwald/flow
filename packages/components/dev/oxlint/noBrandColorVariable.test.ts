import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import rule from "./noBrandColorVariable.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: { lang: "tsx" },
  },
});

const rejected = (name: string) =>
  new RegExp(`^Unexpected Brand CSS variable "${name}"`);

const rejectedRuntime = /^Unexpected "--color--" completed at runtime/;

ruleTester.run("no-brand-color-variable", rule, {
  valid: [
    {
      name: "Semantic, Variant and component variables",
      code: 'const s = { color: "var(--primary--color--1000)", background: "var(--primary-solid-background-color)" };',
    },
    {
      name: "a runtime-built Semantic variable",
      code: "const c = `var(--categorical--color--${color})`;",
    },
    {
      name: "a component token that ends in a Brand-like name",
      code: 'const c = "var(--label--color--default)";',
    },
    {
      name: "a --color-- name that is no Brand group",
      code: 'const c = "var(--color--accent)";',
    },
  ],
  invalid: [
    {
      name: "a Brand variable",
      code: 'const c = "var(--color--mittwald-blue--1000)";',
      errors: [{ message: rejected("--color--mittwald-blue--1000") }],
    },
    {
      name: "a Brand variable in a style attribute",
      code: '<div style={{ color: "var(--color--mittwald-neutral--700)" }} />;',
      errors: [{ message: rejected("--color--mittwald-neutral--700") }],
    },
    {
      name: "a Brand variable set as a custom property",
      code: 'el.style.setProperty("--color--mittwald-blue--1000", "red");',
      errors: [{ message: rejected("--color--mittwald-blue--1000") }],
    },
    {
      name: "a step completed at runtime",
      code: "const c = `var(--color--mittwald-blue--${step})`;",
      errors: [{ message: rejected("--color--mittwald-blue--") }],
    },
    {
      name: "a group completed at runtime",
      code: "const c = `var(--color--${hue}--100)`;",
      errors: [{ message: rejectedRuntime }],
    },
    {
      name: "a step completed by concatenation",
      code: 'const c = "var(--color--mittwald-green--" + step + ")";',
      errors: [{ message: rejected("--color--mittwald-green--") }],
    },
    {
      name: "a group completed by concatenation",
      code: 'const c = "var(--color--" + hue + "--100)";',
      errors: [{ message: rejectedRuntime }],
    },
  ],
});
