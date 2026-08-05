import { fileURLToPath } from "node:url";
import stylelint from "stylelint";
import { describe, expect, test } from "vitest";

const plugin = fileURLToPath(
  new URL("./unlayeredThirdPartyOnly.mjs", import.meta.url),
);

const componentStylesheet =
  "src/components/CodeEditor/CodeEditor.module.scss" as const;

const lint = (code: string, codeFilename: string = componentStylesheet) =>
  stylelint
    .lint({
      code,
      codeFilename,
      customSyntax: "postcss-scss",
      config: {
        plugins: [plugin],
        rules: { "flow/unlayered-third-party-only": true },
      },
    })
    .then((result) => result.results[0]?.warnings ?? []);

describe("flow/unlayered-third-party-only", () => {
  describe("accepts", () => {
    test("a marker block targeting a third-party selector", async () => {
      expect(
        await lint(
          "@layer flow.unlayered { .codeMirror :global(.cm-gutters) { color: red; } }",
        ),
      ).toEqual([]);
    });

    test("a marker block targeting a bare third-party selector", async () => {
      expect(
        await lint(
          "@layer flow.unlayered { :global(.recharts-tooltip-wrapper-right) { margin-inline-start: 1px; } }",
        ),
      ).toEqual([]);
    });

    test("a marker wrapping an at rule around a third-party selector", async () => {
      expect(
        await lint(
          "@layer flow.unlayered { @media (min-width: 40rem) { :global(.cm-line) { color: red; } } }",
        ),
      ).toEqual([]);
    });

    test("a marker at the leaf of a third-party selector", async () => {
      expect(
        await lint(
          ".codeMirror { & :global(.cm-line) { @layer flow.unlayered { color: red; } } }",
        ),
      ).toEqual([]);
    });

    test("a marker at the leaf below a third-party selector", async () => {
      expect(
        await lint(
          ":global(.cm-editor) { &:hover { @layer flow.unlayered { color: red; } } }",
        ),
      ).toEqual([]);
    });

    test("a stylesheet without any marker", async () => {
      expect(await lint(".codeEditor { .copyButton { color: red; } }")).toEqual(
        [],
      );
    });

    test("a real layer that is not the marker", async () => {
      expect(
        await lint("@layer flow.components { .codeEditor { color: red; } }"),
      ).toEqual([]);
    });
  });

  describe("rejects", () => {
    test("a marker targeting a flow owned module class", async () => {
      const [warning, ...rest] = await lint(
        "@layer flow.unlayered { .codeEditor .copyButton { color: red; } }",
      );

      expect(rest).toEqual([]);
      expect(warning?.rule).toBe("flow/unlayered-third-party-only");
      expect(warning?.text).toMatch(/third-party/i);
    });

    test("a marker targeting a global flow class", async () => {
      const [warning] = await lint(
        "@layer flow.unlayered { :global(.flow--button) { color: red; } }",
      );

      expect(warning?.text).toMatch(/third-party/i);
    });

    test("a marker whose third-party selector is only an ancestor", async () => {
      const [warning] = await lint(
        "@layer flow.unlayered { :global(.cm-editor) .copyButton { color: red; } }",
      );

      expect(warning?.text).toMatch(/third-party/i);
    });

    test("a marker outside a component module stylesheet", async () => {
      const [warning, ...rest] = await lint(
        "@layer flow.unlayered { :global(.cm-line) { color: red; } }",
        "src/styles/globals.scss",
      );

      expect(rest).toEqual([]);
      expect(warning?.text).toMatch(/component module stylesheet/i);
    });

    test("every offending rule of a marker block", async () => {
      const warnings = await lint(
        "@layer flow.unlayered { .copyButton { color: red; } .codeEditor { color: blue; } }",
      );

      expect(warnings).toHaveLength(2);
    });
  });
});
