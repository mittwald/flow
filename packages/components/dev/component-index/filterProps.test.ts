import { expect, test } from "vitest";
import type { PropItem } from "react-docgen-typescript";
import {
  isConsumerProp,
  isInternalProp,
  propOrigin,
  propType,
} from "./filterProps";

const prop = (
  name: string,
  parentFileName: string,
  overrides: Partial<PropItem> = {},
): PropItem =>
  ({
    name,
    description: "",
    required: false,
    defaultValue: null,
    type: { name: "string" },
    parent: { fileName: parentFileName, name: "SomeProps" },
    ...overrides,
  }) as PropItem;

// Real `parent.fileName` values as react-docgen-typescript emits them here.
const FLOW = "components/src/components/Button/Button.tsx";
const RT_DOM =
  "flow/node_modules/.pnpm/@react-types+shared@3.36.0_react@19.2.7/node_modules/@react-types/shared/src/dom.d.ts";
const RT_EVENTS =
  "flow/node_modules/.pnpm/@react-types+shared@3.36.0_react@19.2.7/node_modules/@react-types/shared/src/events.d.ts";
const RAC =
  "flow/node_modules/.pnpm/react-aria-components@1.19.0/node_modules/react-aria-components/dist/types/src/utils.d.ts";
const TYPES_REACT =
  "flow/node_modules/.pnpm/@types+react@19.2.17/node_modules/@types/react/index.d.ts";

test.each([
  ["Flow source", FLOW, "own"],
  ["@types/react", TYPES_REACT, "react"],
  ["@react-types/shared", RT_DOM, "react-aria"],
  ["react-aria-components", RAC, "react-aria"],
  ["no parent file", "", "unknown"],
])("propOrigin: %s", (_description, fileName, expected) => {
  expect(propOrigin(prop("x", fileName))).toBe(expected);
});

test.each([
  // Flow's own props
  ["variant", FLOW, true],
  // react-aria behaviour API
  ["onPress", RT_EVENTS, true],
  ["onFocus", RT_EVENTS, true],
  ["isDisabled", RT_DOM, true],
  ["children", RAC, true],
  ["className", RAC, true],
  // aria-* declared by react-aria is API
  ["aria-label", RT_DOM, true],
  ["aria-colindextext", RT_DOM, true],
  // from @types/react only the four a consumer actually sets survive
  ["aria-label", TYPES_REACT, true],
  ["aria-hidden", TYPES_REACT, true],
  ["aria-colindextext", TYPES_REACT, false],
  ["aria-braillelabel", TYPES_REACT, false],
  // inherited HTML/SVG attribute floods
  ["strokeDasharray", TYPES_REACT, false],
  ["ref", TYPES_REACT, false],
  // capture-phase twins and raw DOM handlers
  ["onClickCapture", RT_DOM, false],
  ["onMouseEnter", RT_DOM, false],
  ["onPointerDown", RT_DOM, false],
  ["onTransitionEnd", RT_DOM, false],
  // a Flow-declared handler is never dropped, whatever it is called
  ["onMouseEnter", FLOW, true],
])("isConsumerProp: %s from %s", (name, fileName, expected) => {
  expect(isConsumerProp(name, prop(name, fileName))).toBe(expected);
});

test("isInternalProp reads the JSDoc", () => {
  expect(
    isInternalProp(prop("x", FLOW, { description: "Some prop. @internal" })),
  ).toBe(true);
  expect(isInternalProp(prop("x", FLOW, { description: "Some prop." }))).toBe(
    false,
  );
});

test.each([
  [
    "strips undefined from an optional union",
    "color",
    '"primary" | "danger" | undefined',
    '"primary" | "danger"',
  ],
  ["strips null", "color", "string | null", "string"],
  [
    "keeps nested nullish members",
    "columns",
    "(number | null)[] | undefined",
    "(number | null)[]",
  ],
  [
    "keeps an arrow return type intact",
    "onChange",
    "((value: string) => void) | null",
    "((value: string) => void)",
  ],
  ["keeps a plain type", "size", '"s" | "m"', '"s" | "m"'],
  [
    "collapses children",
    "children",
    "ReactElement<unknown, string | JSXElementConstructor<any>>",
    "ReactNode",
  ],
])("propType: %s", (_description, name, typeName, expected) => {
  expect(propType(name, prop(name, FLOW, { type: { name: typeName } }))).toBe(
    expected,
  );
});
