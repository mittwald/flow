/** @type {import("stylelint").Config} */

// Physical properties that are NOT inline-direction sensitive (block-axis and
// sizing). We only nudge the left/right (inline) properties toward logical
// equivalents — matching the recurring review feedback — and leave block-axis
// and sizing physical properties untouched.
const nonDirectionalPhysicalProperties = [
  "width",
  "height",
  "min-width",
  "min-height",
  "max-width",
  "max-height",
  "top",
  "bottom",
  "margin-top",
  "margin-bottom",
  "padding-top",
  "padding-bottom",
  "border-top",
  "border-bottom",
  "border-top-width",
  "border-bottom-width",
  "border-top-color",
  "border-bottom-color",
  "border-top-style",
  "border-bottom-style",
  "overflow-x",
  "overflow-y",
  "overscroll-behavior-x",
  "overscroll-behavior-y",
  "scroll-margin-top",
  "scroll-margin-bottom",
  "scroll-padding-top",
  "scroll-padding-bottom",
];

export default {
  plugins: ["stylelint-scss", "stylelint-plugin-logical-css"],
  extends: ["stylelint-config-standard", "stylelint-config-recommended-scss"],
  rules: {
    "custom-property-pattern": null,
    "selector-class-pattern": null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: ["global"],
      },
    ],
    "media-feature-range-notation": null,
    "block-no-redundant-nested-style-rules": null,
    "scss/at-extend-no-missing-placeholder": null,
    "property-no-vendor-prefix": null,
    "alpha-value-notation": null,
    "color-function-notation": null,
    "color-function-alias-notation": null,
    // Nudge inline-direction (left/right) physical properties and keywords
    // toward their logical equivalents (e.g. margin-left -> margin-inline-start,
    // text-align: left -> start). Autofixable via `stylelint --fix`. Block-axis
    // and sizing properties are intentionally excluded.
    "logical-css/require-logical-properties": [
      true,
      { fix: true, ignore: nonDirectionalPhysicalProperties },
    ],
    "logical-css/require-logical-keywords": [true, { fix: true }],
  },
  overrides: [
    {
      // Component styles should reach for classes over element-type selectors
      // (a recurring review nudge). Kept as a non-blocking warning: some type
      // selectors are legitimate (e.g. styling React-Aria internals or svg that
      // carry no class), and there is no autofix.
      files: ["**/*.module.css", "**/*.module.scss"],
      rules: {
        "selector-max-type": [0, { severity: "warning" }],
      },
    },
  ],
};
