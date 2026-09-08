import { fileURLToPath } from "node:url";
import postcssScss from "postcss-scss";
import stylelint from "stylelint";
import { describe, expect, test } from "vitest";
import { collectKnownGlobalFlowClasses } from "./noUnknownGlobalFlowClass.mjs";

const plugin = fileURLToPath(
  new URL("./noUnknownGlobalFlowClass.mjs", import.meta.url),
);

const componentStylesheet =
  "src/components/CodeEditor/CodeEditor.module.scss" as const;

const lint = (code: string, codeFilename: string = componentStylesheet) =>
  stylelint
    .lint({
      code,
      codeFilename,
      // Pass the syntax module itself: stylelint resolves a bare specifier
      // from the config's basedir (the repository root), where postcss-scss
      // is not installed.
      customSyntax: postcssScss,
      config: {
        plugins: [plugin],
        rules: { "flow/no-unknown-global-flow-class": true },
      },
    })
    .then((result) => result.results[0]?.warnings ?? []);

describe("collectKnownGlobalFlowClasses", () => {
  const known = collectKnownGlobalFlowClasses();

  test("collects a root class with the suffix dropped", () => {
    // `.columnLayout` in ColumnLayout.module.scss — the generator drops a
    // suffix that equals the component name. Getting this wrong is what makes
    // hand-derived names fail silently.
    expect(known).toContain("flow--column-layout");
    expect(known).not.toContain("flow--column-layout--column-layout");
  });

  test("collects a nested class with its component path", () => {
    expect(known).toContain("flow--column-layout--column-layout-container");
    expect(known).toContain("flow--list--list-item-view--bottom-content");
  });

  test("ignores the :global() targets a stub echoes back", () => {
    // `Item.module.scss` references `:global(.flow--avatar)`, so its stub lists
    // that name too. Taking it as a local class would mangle it into a name
    // nothing generates — and would let a broken reference vouch for itself.
    expect(known).not.toContain("flow--list--items--item--flow--avatar");
  });

  test("collects classes a mixin produces, which the stylesheet never spells out", () => {
    // `Text.module.scss` emits these through `@include color(dark)`, so only
    // the compiled stub knows about them.
    expect(known).toContain("flow--text--dark-static");
  });
});

describe("flow/no-unknown-global-flow-class", () => {
  describe("accepts", () => {
    test("a class a component generates", async () => {
      expect(await lint(":global(.flow--button) { color: red; }")).toEqual([]);
    });

    test("several classes inside one :global()", async () => {
      expect(
        await lint(
          ":global(.flow--checkbox .flow--checkbox--icon) { color: red; }",
        ),
      ).toEqual([]);
    });

    test("a class carrying a pseudo class or an attribute", async () => {
      expect(
        await lint(
          ".toolbar:has(:global(.flow--text-area--input[data-invalid])) { color: red; }",
        ),
      ).toEqual([]);
    });

    test("a third-party global, which the rule does not own", async () => {
      expect(await lint(":global(.react-aria-Modal) { color: red; }")).toEqual(
        [],
      );
    });

    test("a local class that is not global at all", async () => {
      expect(await lint(".codeEditor { color: red; }")).toEqual([]);
    });
  });

  describe("rejects", () => {
    test("a name the generator never produces", async () => {
      const [warning, ...rest] = await lint(
        ":global(.flow--nonexistent-component) { color: red; }",
      );

      expect(rest).toEqual([]);
      expect(warning?.rule).toBe("flow/no-unknown-global-flow-class");
      expect(warning?.text).toMatch(/matches nothing/);
    });

    test("a root class whose suffix was not dropped", async () => {
      const [warning] = await lint(
        ":global(.flow--column-layout--column-layout) { color: red; }",
      );

      expect(warning?.text).toMatch(/matches nothing/);
    });

    test("names the closest known class as a suggestion", async () => {
      const [warning] = await lint(
        ":global(.flow--list--items--item--view--bottom-content) { color: red; }",
      );

      expect(warning?.text).toContain(
        'Did you mean ".flow--list--list-item-view--bottom-content"?',
      );
    });

    test("points at the class name itself, not at the rule", async () => {
      const [warning] = await lint(
        ".toolbar:has(:global(.flow--nope)) { color: red; }",
      );

      expect(warning?.column).toBe(".toolbar:has(:global(.".length + 1);
      expect(warning?.endColumn).toBe(
        ".toolbar:has(:global(.flow--nope".length + 1,
      );
    });

    test("reports every unknown class in one selector", async () => {
      const warnings = await lint(
        ":global(.flow--nope-one .flow--nope-two) { color: red; }",
      );

      expect(warnings).toHaveLength(2);
    });
  });
});
