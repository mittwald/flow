import fs from "fs";
import os from "os";
import path from "path";
import { afterAll, beforeAll, expect, test } from "vitest";
import { mdxToMarkdown } from "./mdxToMarkdown";

let dir: string;

const convert = (mdx: string): string => {
  const filePath = path.join(dir, "index.mdx");
  fs.writeFileSync(filePath, mdx);
  return mdxToMarkdown(filePath);
};

beforeAll(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), "mdx-to-markdown-"));
});

afterAll(() => {
  fs.rmSync(dir, { recursive: true, force: true });
});

test("strips the frontmatter", () => {
  expect(convert("---\ntitle: Button\n---\n\nText.\n")).toBe("Text.\n");
});

test("labels a Do/Dont tile", () => {
  expect(convert("<Do>\n  Tu das.\n</Do>\n")).toBe("**✅ Do**\n\nTu das.\n");
  expect(convert("<Dont>\n  Lass das.\n</Dont>\n")).toBe(
    "**⛔️ Don't**\n\nLass das.\n",
  );
});

test("a heading attribute replaces the tile's default label", () => {
  expect(convert('<Do heading="Verwende Buttons">\n  Text.\n</Do>\n')).toBe(
    "**✅ Verwende Buttons**\n\nText.\n",
  );
});

test("a Plain tile keeps its heading and has no marker", () => {
  expect(
    convert(
      '<Plain heading="Verwende Links, um z. B. ...">\n  Text.\n</Plain>\n',
    ),
  ).toBe("**Verwende Links, um z. B. ...**\n\nText.\n");
});

test("a Plain tile without a heading emits no label", () => {
  expect(convert("<Plain>\n  Text.\n</Plain>\n")).toBe("Text.\n");
});

test("dedents a tile's list so the items stay on one level", () => {
  const markdown = convert(
    [
      '<Plain heading="Verwende Buttons, um z. B. ...">',
      "    - eine Aktion auszuführen.",
      "    - Formulare zu speichern.",
      "",
      "  </Plain>",
      "",
    ].join("\n"),
  );

  expect(markdown).toBe(
    [
      "**Verwende Buttons, um z. B. ...**",
      "",
      "- eine Aktion auszuführen.",
      "- Formulare zu speichern.",
      "",
    ].join("\n"),
  );
});

test("unwraps a block-level wrapper without leaving its indentation behind", () => {
  const markdown = convert(
    ["<Alert>", "    Wichtiger Hinweis.", "</Alert>", ""].join("\n"),
  );

  expect(markdown).toBe("Wichtiger Hinweis.\n");
});

test("unwraps nested block-level wrappers", () => {
  const markdown = convert(
    [
      "<Alert>",
      "  <Heading>Titel</Heading>",
      "  <Content>",
      "    Inhalt.",
      "  </Content>",
      "</Alert>",
      "",
    ].join("\n"),
  );

  expect(markdown).toBe("Titel\n\nInhalt.\n");
});

test("makes root-relative links absolute", () => {
  expect(convert("Siehe [Modal](/04-components/overlays/modal).\n")).toBe(
    "Siehe [Modal](https://flow.mittwald.de/04-components/overlays/modal).\n",
  );
});

test("leaves absolute and anchor links alone", () => {
  const links = "[a](https://example.com/x) [b](#anchor) [c](./relative)\n";

  expect(convert(links)).toBe(links);
});

test("never rewrites links inside code", () => {
  const code = '```tsx\n<Link href="/foo" />\n```\n';

  expect(convert(code)).toBe(code);
});

test("expands a DesignTokenTable to token names and values", () => {
  const markdown = convert('<DesignTokenTable path="color.gray" />\n');

  expect(markdown).toContain("| Token | Wert |");
  expect(markdown).toContain("| `--color--gray--100` | `#FFFFFF` |");
});

test("drops a DesignTokenTable with an unknown path", () => {
  expect(convert('<DesignTokenTable path="color.nope" />\n')).toBe("\n");
});

test("keeps inline code untouched by JSX stripping", () => {
  expect(convert("Nutze `<Button />` dafür.\n")).toBe(
    "Nutze `<Button />` dafür.\n",
  );
});
