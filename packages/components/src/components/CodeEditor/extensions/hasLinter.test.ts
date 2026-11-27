import { linter, lintGutter } from "@codemirror/lint";
import { Compartment, Prec } from "@codemirror/state";
import { lineNumbers } from "@uiw/react-codemirror";
import { hasLinter } from "./hasLinter";

const source = () => [];

test("hasLinter finds a linter among the extensions", () => {
  expect(hasLinter([lineNumbers(), linter(source)])).toBe(true);
});

test("hasLinter finds a linter wrapped in a precedence or a compartment", () => {
  expect(hasLinter([Prec.high(linter(source))])).toBe(true);
  expect(hasLinter(new Compartment().of([linter(source)]))).toBe(true);
});

test("hasLinter finds none without a linter", () => {
  expect(hasLinter([])).toBe(false);
  expect(hasLinter([lineNumbers(), lintGutter()])).toBe(false);
});
