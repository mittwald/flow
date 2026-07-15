import jetpack from "fs-jetpack";
import path from "path";
import loadProperties from "@/lib/PropertiesTables/lib/loadProperties";
import { propertiesToMarkdown } from "@/lib/llms/propertiesToMarkdown";

interface Options {
  componentName?: string;
}

const EXAMPLE_TILE_TAGS = ["Do", "Dont", "Info", "Plain", "MStudio"] as const;
type ExampleTileTag = (typeof EXAMPLE_TILE_TAGS)[number];

const TILE_LABELS: Record<ExampleTileTag, string> = {
  Do: "**✅ Do**",
  Dont: "**⛔️ Don't**",
  Info: "**ℹ️ Info**",
  Plain: "",
  MStudio: "**mStudio**",
};

const placeholderToken = (index: number): string => `@@LLMPH${index}@@`;
const PLACEHOLDER_PATTERN = /@@LLMPH(\d+)@@/g;

const stripFrontmatter = (raw: string): string =>
  raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");

const readExample = (dir: string, name: string): string | null => {
  const filePath = path.join(dir, "examples", `${name}.tsx`);
  const code = jetpack.read(filePath);
  if (!code) {
    return null;
  }
  return code.replace(/;\r?\n?$/, "").trim();
};

const attr = (tag: string, name: string): string | undefined =>
  new RegExp(`${name}=["']([^"']*)["']`).exec(tag)?.[1];

export const mdxToMarkdown = (
  filePath: string,
  options: Options = {},
): string => {
  const raw = jetpack.read(filePath);
  if (raw === undefined) {
    throw new Error(`Could not read MDX file: ${filePath}`);
  }
  const dir = path.dirname(filePath);

  const placeholders: string[] = [];
  const stash = (content: string): string => {
    placeholders.push(content);
    return placeholderToken(placeholders.length - 1);
  };

  let body = stripFrontmatter(raw);

  // Protect existing code (fenced blocks first, then inline spans) so JSX
  // stripping never touches sample code such as `<Button />`.
  body = body.replaceAll(/```[\s\S]*?```/g, (block) => stash(block));
  body = body.replaceAll(/`[^`\n]+`/g, (span) => stash(span));

  // LiveCodeEditor -> fenced code block from the referenced example file.
  body = body.replaceAll(/<LiveCodeEditor\b[\s\S]*?\/>/g, (tag) => {
    const code = readExample(dir, attr(tag, "example") ?? "default");
    return code ? `\n\n${stash(`\`\`\`tsx\n${code}\n\`\`\``)}\n\n` : "";
  });

  // PropertiesTables -> Markdown tables from the generated doc-properties.
  body = body.replaceAll(/<PropertiesTables\s*\/>/g, () => {
    if (!options.componentName) {
      return "";
    }
    const properties = loadProperties(options.componentName);
    if (!properties) {
      return "_Keine Properties vorhanden._";
    }
    return `\n\n${stash(propertiesToMarkdown(properties))}\n\n`;
  });

  // DesignTokenTable -> short reference note (values live in the design tokens).
  body = body.replaceAll(/<DesignTokenTable\b[^>]*\/>/g, (tag) => {
    const tokenPath = attr(tag, "path");
    return tokenPath ? `\n\n_Design Tokens: \`${tokenPath}\`_\n\n` : "";
  });

  // Do / Dont / Info / Plain / MStudio example tiles (paired and self-closing).
  const tagUnion = EXAMPLE_TILE_TAGS.join("|");
  const renderTile = (tag: string, name: ExampleTileTag, children: string) => {
    const parts: string[] = [];
    const label = TILE_LABELS[name];
    if (label) {
      parts.push(label);
    }
    const text = children.trim() || attr(tag, "exampleText") || "";
    if (text) {
      parts.push(text);
    }
    const exampleName = attr(tag, "example");
    if (exampleName) {
      const code = readExample(dir, exampleName);
      if (code) {
        parts.push(stash(`\`\`\`tsx\n${code}\n\`\`\``));
      }
    }
    return `\n\n${parts.join("\n\n")}\n\n`;
  };
  body = body.replaceAll(
    new RegExp(`<(${tagUnion})\\b([^>]*)>([\\s\\S]*?)<\\/\\1>`, "g"),
    (_match, name: ExampleTileTag, attrs: string, children: string) =>
      renderTile(`<${name}${attrs}>`, name, children),
  );
  body = body.replaceAll(
    new RegExp(`<(${tagUnion})\\b([^>]*)\\/>`, "g"),
    (_match, name: ExampleTileTag, attrs: string) =>
      renderTile(`<${name}${attrs}/>`, name, ""),
  );

  // Drop any remaining JSX (wrappers, interactive demos), keeping inner text.
  body = body
    .replaceAll(/^[ \t]*<\/?[A-Z][A-Za-z0-9]*(?:\s[^>]*?)?\/?>[ \t]*$/gm, "")
    .replaceAll(/<\/?[A-Z][A-Za-z0-9]*(?:\s[^>]*?)?\/?>/g, "");

  // Restore stashed code blocks / spans / tables.
  body = body.replaceAll(
    PLACEHOLDER_PATTERN,
    (_match, index: string) => placeholders[Number(index)] ?? "",
  );

  return `${body.replaceAll(/\n{3,}/g, "\n\n").trim()}\n`;
};
