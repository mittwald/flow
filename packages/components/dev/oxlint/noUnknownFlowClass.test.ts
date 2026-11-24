import { RuleTester } from "oxlint/plugins-dev";
import { describe, it } from "vitest";
import rule from "./noUnknownFlowClass.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: { lang: "tsx" },
  },
});

const unknown = (className: string) =>
  new RegExp(
    `^Unexpected "${className}" — no Flow component generates that class`,
  );

const unknownPrefix = (className: string) =>
  new RegExp(
    `^Unexpected "${className}" — no Flow component generates a class starting with it`,
  );

ruleTester.run("no-unknown-flow-class", rule, {
  valid: [
    {
      name: "a class a component generates",
      code: 'const c = "flow--button";',
    },
    {
      name: "a className attribute naming several classes",
      code: '<div className="flow--table--row flow--table--cell" />;',
    },
    {
      name: "a selector with a pseudo class or an attribute",
      code: 'document.querySelector(".flow--popover--content[data-x]:hover");',
    },
    {
      name: "a prefix completed by concatenation",
      code: 'const c = "flow--button--" + color;',
    },
    {
      name: "a prefix inside a concatenated string",
      code: 'const c = base + " flow--button--" + color;',
    },
    {
      name: "a prefix completed by an interpolation",
      code: "const c = `flow--button--${color}`;",
    },
    {
      name: "a partial name completed by an interpolation",
      code: "const c = `flow--but${suffix}`;",
    },
    {
      name: "the bare prefix in an attribute selector",
      code: 'const c = "[class*=\\"flow--\\"]";',
    },
    {
      name: "a name that merely contains flow--",
      code: 'const c = "overflow--nope";',
    },
  ],
  invalid: [
    {
      name: "a name the generator never produces",
      code: 'const c = "flow--nonexistent";',
      errors: [{ message: unknown("flow--nonexistent") }],
    },
    {
      name: "a root class whose suffix was not dropped",
      code: '<div className="flow--column-layout--column-layout" />;',
      errors: [{ message: unknown("flow--column-layout--column-layout") }],
    },
    {
      name: "names the closest known class as a suggestion",
      code: 'const c = "flow--alert-icon";',
      errors: [{ message: /Did you mean "flow--alert--icon"\?/ }],
    },
    {
      name: "a prefix no known class starts with",
      code: "const c = `flow--buton--${color}`;",
      errors: [
        {
          message: new RegExp(
            `${unknownPrefix("flow--buton--").source}.*Did you mean "flow--button--"\\?`,
          ),
        },
      ],
    },
    {
      name: "an unknown prefix completed by concatenation",
      code: 'const c = "flow--nonexistent--" + size;',
      errors: [{ message: unknownPrefix("flow--nonexistent--") }],
    },
    {
      name: "a complete name inside a template literal",
      code: "const c = `${base} flow--nope ${other}`;",
      errors: [{ message: unknown("flow--nope") }],
    },
    {
      name: "a complete name directly after an interpolation",
      code: "const c = `${base}flow--nope`;",
      errors: [{ message: unknown("flow--nope") }],
    },
    {
      name: "a name behind an escape sequence",
      code: 'const c = "flow--button\\nflow--nope";',
      errors: [{ message: unknown("flow--nope") }],
    },
    {
      name: "every unknown class in one string",
      code: 'const c = "flow--nope-one flow--nope-two";',
      errors: 2,
    },
  ],
});
