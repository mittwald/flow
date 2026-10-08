import { fileURLToPath } from "node:url";
import postcssScss from "postcss-scss";
import stylelint from "stylelint";
import { describe, expect, test } from "vitest";

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

    test("a lookalike built from a third-party global", async () => {
      const [warning] = await lint(
        ":global(.flow--calendar--react-aria-heading) { color: red; }",
      );

      expect(warning?.text).toMatch(/matches nothing/);
    });

    test("reports every unknown class in one selector", async () => {
      const warnings = await lint(
        ":global(.flow--nope-one .flow--nope-two) { color: red; }",
      );

      expect(warnings).toHaveLength(2);
    });
  });
});
