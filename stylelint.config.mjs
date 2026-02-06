/** @type {import("stylelint").Config} */
export default {
  plugins: ["stylelint-scss"],
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
  },
};
