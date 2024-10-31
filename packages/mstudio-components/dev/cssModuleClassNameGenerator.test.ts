import { expect, test } from "vitest";
import { cssModuleClassNameGenerator } from "./cssModuleClassNameGenerator";

test.each([
  [
    {
      filename: "src/foo/styles.module.css",
      className: "foo",
      expected: "foo",
    },
  ],
  [
    {
      filename: "src/foo/styles.module.scss",
      className: "foo",
      expected: "foo",
    },
  ],
])(
  "class names are generated correctly for %o",
  ({ filename, className, expected }) => {
    expect(cssModuleClassNameGenerator(className, filename)).toBe(expected);
  },
);
