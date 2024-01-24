import { test } from "@jest/globals";
import { cssModuleClassNameGenerator } from "./cssModuleClassNameGenerator";

test.each([
  [
    {
      filename: "src/foo/styles.modules.css",
      className: "foo",
      expected: "foo",
    },
  ],
  [
    {
      filename: "src/foo/styles.modules.scss",
      className: "foo",
      expected: "foo",
    },
  ],
  [
    {
      filename: "src/components/Slider/styles.css",
      className: "foo",
      expected: "foo",
    },
  ],
  [
    {
      filename: "src/components/Slider/styles.module.css",
      className: "slider",
      expected: "flow--slider",
    },
  ],
  [
    {
      filename: "src/components/AdvancedSlider/styles.module.css",
      className: "advanced-slider",
      expected: "flow--advanced-slider",
    },
  ],
  [
    {
      filename: "src/components/Slider/styles.module.css",
      className: "thumb",
      expected: "flow--slider--thumb",
    },
  ],
  [
    {
      filename: "src/components/Slider/components/Thumb/styles.module.css",
      className: "thumb",
      expected: "flow--slider--thumb",
    },
  ],
  [
    {
      filename: "src/components/Slider/components/Thumb/styles.module.css",
      className: "tooltip",
      expected: "flow--slider--thumb--tooltip",
    },
  ],
])(
  "class names are generated correctly for %o",
  ({ filename, className, expected }) => {
    expect(cssModuleClassNameGenerator(className, filename)).toBe(expected);
  },
);
