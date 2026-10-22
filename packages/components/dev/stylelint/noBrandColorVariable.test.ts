import { fileURLToPath } from "node:url";
import postcssScss from "postcss-scss";
import stylelint from "stylelint";
import { describe, expect, test } from "vitest";

const plugin = fileURLToPath(
  new URL("./noBrandColorVariable.mjs", import.meta.url),
);

const lint = (code: string) =>
  stylelint
    .lint({
      code,
      codeFilename: "src/components/Button/Button.module.scss",
      // Pass the syntax module itself: stylelint resolves a bare specifier
      // from the config's basedir (the repository root), where postcss-scss
      // is not installed.
      customSyntax: postcssScss,
      config: {
        plugins: [plugin],
        rules: { "flow/no-brand-color-variable": true },
      },
    })
    .then((result) => result.results[0]?.warnings ?? []);

describe("flow/no-brand-color-variable", () => {
  describe("accepts", () => {
    test("Semantic, Variant and component variables", async () => {
      expect(
        await lint(`.button {
          color: var(--primary--color--1000);
          background: var(--primary-solid-background-color);
          border-color: var(--button--border-color);
        }`),
      ).toEqual([]);
    });

    test("a component token that ends in a Brand-like name", async () => {
      expect(
        await lint(".label { color: var(--label--color--default); }"),
      ).toEqual([]);
    });
  });

  describe("rejects", () => {
    test("a Brand variable", async () => {
      const [warning, ...rest] = await lint(
        ".button { color: var(--color--mittwald-blue--1000); }",
      );

      expect(rest).toEqual([]);
      expect(warning?.rule).toBe("flow/no-brand-color-variable");
      expect(warning?.text).toContain(
        'Unexpected Brand CSS variable "--color--mittwald-blue--1000"',
      );
    });

    test("an alpha group", async () => {
      const [warning] = await lint(
        ".overlay { background: var(--color--black-alpha--400); }",
      );

      expect(warning?.text).toContain("--color--black-alpha--400");
    });

    test("a Brand variable inside a fallback or a function", async () => {
      const warnings = await lint(
        ".button { color: color-mix(in srgb, var(--x, var(--color--mittwald-green--500)) 50%, var(--color--system-danger--1000)); }",
      );

      expect(warnings).toHaveLength(2);
    });

    test("a Brand variable assigned to a custom property or an SCSS variable", async () => {
      const warnings = await lint(`
        $accent: var(--color--mittwald-lilac--300);
        .button { --button--accent: var(--color--mittwald-lilac--300); }
      `);

      expect(warnings).toHaveLength(2);
    });

    test("a Brand variable redefined for a subtree", async () => {
      const [warning] = await lint(
        ".button { --color--mittwald-blue--1000: red; }",
      );

      expect(warning?.text).toContain("--color--mittwald-blue--1000");
    });

    test("a Brand variable passed to a mixin", async () => {
      const [warning] = await lint(
        ".button { @include tint(var(--color--mittwald-navy--800)); }",
      );

      expect(warning?.text).toContain("--color--mittwald-navy--800");
    });

    test("a group completed by SCSS interpolation", async () => {
      const [warning] = await lint(
        "@each $hue in blue, navy { .#{$hue} { color: var(--color--mittwald-#{$hue}--1000); } }",
      );

      expect(warning?.text).toContain(
        'Unexpected "--color--mittwald-" completed at runtime',
      );
    });

    test("points at the variable itself", async () => {
      const [warning] = await lint(
        ".button { color: var(--color--mittwald-blue--1000); }",
      );

      expect(warning?.column).toBe(".button { color: var(".length + 1);
      expect(warning?.endColumn).toBe(
        ".button { color: var(--color--mittwald-blue--1000".length + 1,
      );
    });
  });
});
