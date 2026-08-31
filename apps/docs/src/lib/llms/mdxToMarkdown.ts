import jetpack from "fs-jetpack";
import path from "path";
import lightDesignTokens from "@mittwald/flow-design-tokens/json-runtime/all-light.json";
import loadProperties from "@/lib/PropertiesTables/lib/loadProperties";
import { propertiesToMarkdown } from "@/lib/llms/propertiesToMarkdown";
import {
  collectTokensInPath,
  tokenName,
} from "@/lib/designTokens/collectTokens";
import { absoluteUrl } from "@/lib/llms/siteUrls";

interface Options {
  componentName?: string;
}

const EXAMPLE_TILE_TAGS = ["Do", "Dont", "Info", "Plain", "MStudio"] as const;
type ExampleTileTag = (typeof EXAMPLE_TILE_TAGS)[number];

const TILE_HEADINGS: Record<
  ExampleTileTag,
  { marker: string; default: string }
> = {
  Do: { marker: "✅", default: "Do" },
  Dont: { marker: "⛔️", default: "Don't" },
  Info: { marker: "ℹ️", default: "Info" },
  Plain: { marker: "", default: "" },
  MStudio: { marker: "", default: "mStudio" },
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

const designTokenTableToMarkdown = (tokenPath: string): string => {
  const tokens = collectTokensInPath(tokenPath, lightDesignTokens);
  if (tokens.length === 0) {
    return "";
  }

  return [
    "| Token | Wert |",
    "| --- | --- |",
    ...tokens.map(
      (token) => `| \`--${tokenName(token)}\` | \`${token.value}\` |`,
    ),
  ].join("\n");
};

const dedent = (content: string): string => {
  const lines = content.trimEnd().split("\n");
  const startsOnTagLine = (lines[0]?.trim().length ?? 0) > 0;

  const measured = (startsOnTagLine ? lines.slice(1) : lines).filter(
    (line) => line.trim().length > 0,
  );
  const shortest =
    measured.length > 0
      ? Math.min(
          ...measured.map((line) => line.length - line.trimStart().length),
        )
      : 0;

  return lines
    .map((line, index) =>
      startsOnTagLine && index === 0 ? line : line.slice(shortest),
    )
    .join("\n")
    .trim();
};

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

  // DesignTokenTable -> the token names and values, same rows the rendered
  // table shows. Naming just the token path told an agent that tokens exist
  // without telling it which.
  body = body.replaceAll(/<DesignTokenTable\b[^>]*\/>/g, (tag) => {
    const tokenPath = attr(tag, "path");
    if (!tokenPath) {
      return "";
    }
    const table = designTokenTableToMarkdown(tokenPath);
    return table ? `\n\n${stash(table)}\n\n` : "";
  });

  // Do / Dont / Info / Plain / MStudio example tiles (paired and self-closing).
  const tagUnion = EXAMPLE_TILE_TAGS.join("|");
  const renderTile = (tag: string, name: ExampleTileTag, children: string) => {
    const parts: string[] = [];
    const { marker, default: fallback } = TILE_HEADINGS[name];
    const heading = attr(tag, "heading") ?? fallback;
    if (heading) {
      parts.push(`**${marker ? `${marker} ` : ""}${heading}**`);
    }
    const text = dedent(children) || attr(tag, "exampleText") || "";
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

  // Unwrap block-level JSX (Alert, WithBoundaries, Row/Column, …), keeping the
  // content and removing the indentation the wrapper gave it. Dropping the tags
  // alone left the block indented, which turns a paragraph into a code fence.
  // Loops because unwrapping an outer wrapper exposes the inner one.
  let unwrapped: string;
  do {
    unwrapped = body;
    body = body.replaceAll(
      /^[ \t]*<([A-Z][A-Za-z0-9]*)(?:\s[^>]*?)?>[ \t]*\n([\s\S]*?)\n[ \t]*<\/\1>[ \t]*$/gm,
      (_match, _tag: string, children: string) => `\n${dedent(children)}\n`,
    );
  } while (body !== unwrapped);

  // Drop any remaining JSX (self-closing tags, inline wrappers), keeping text.
  body = body
    .replaceAll(/^[ \t]*<\/?[A-Z][A-Za-z0-9]*(?:\s[^>]*?)?\/?>[ \t]*$/gm, "")
    .replaceAll(/<\/?[A-Z][A-Za-z0-9]*(?:\s[^>]*?)?\/?>/g, "");

  // Root-relative links only resolve inside the site. A `/raw/*.md` file is
  // fetched on its own, so they have to carry the origin.
  body = body.replaceAll(/\]\(\/(?!\/)/g, `](${absoluteUrl("/")}`);

  // Restore stashed code blocks / spans / tables.
  body = body.replaceAll(
    PLACEHOLDER_PATTERN,
    (_match, index: string) => placeholders[Number(index)] ?? "",
  );

  // Removed tags leave whitespace-only lines behind, which stop the blank-line
  // collapse below from seeing consecutive blank lines as such.
  return `${body
    .replaceAll(/^[ \t]+$/gm, "")
    .replaceAll(/\n{3,}/g, "\n\n")
    .trim()}\n`;
};
