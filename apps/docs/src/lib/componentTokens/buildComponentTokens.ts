import type { ComponentToken, ComponentTokens } from "./types";

/** A token as style-dictionary's `json` format writes it. */
export interface SourceToken {
  path: string[];
  value: unknown;
  filePath: string;
  original: { value: unknown };
}

const isSourceToken = (node: unknown): node is SourceToken =>
  typeof node === "object" &&
  node !== null &&
  "path" in node &&
  "value" in node &&
  "filePath" in node &&
  "original" in node;

const collect = (node: unknown, collector: SourceToken[] = []) => {
  if (isSourceToken(node)) {
    collector.push(node);
  } else if (typeof node === "object" && node !== null) {
    for (const child of Object.values(node)) {
      collect(child, collector);
    }
  }
  return collector;
};

/** Base tokens sit at the top of `src/`, component tokens one level deeper. */
const isComponentToken = (token: SourceToken) =>
  /^src\/[^/]+\/[^/]+\.yml$/.test(token.filePath);

const cssVariable = (path: string[]) => `--${path.join("--")}`;

const singleReference = /^\{([^}]+)\}$/;

/** `calc({size-px.s} * 2)` becomes `calc(var(--size-px--s) * 2)`. */
const formatExpression = (expression: string) =>
  expression.replaceAll(
    /\{([^}]+)\}/g,
    (_, reference: string) => `var(${cssVariable(reference.split("."))})`,
  );

/**
 * Follows `{a.b}` references down to the value: the CSS variable of every step,
 * and the expression a chain ends in when it is a `calc()` rather than a plain
 * value. Themes share the chain — only the palette values differ.
 */
const resolveChain = (
  token: SourceToken,
  byPath: Map<string, SourceToken>,
): { references: string[]; expression?: string } => {
  const references: string[] = [];
  let current: SourceToken | undefined = token;

  while (current) {
    const original = current.original.value;
    if (typeof original !== "string" || !original.includes("{")) {
      break;
    }
    const reference = singleReference.exec(original)?.[1];
    if (!reference) {
      return { references, expression: formatExpression(original) };
    }
    references.push(cssVariable(reference.split(".")));
    current = byPath.get(reference);
  }

  return { references };
};

export const buildComponentTokens = (
  light: unknown,
  dark: unknown,
): ComponentTokens => {
  const lightTokens = collect(light);
  const byPath = new Map(
    lightTokens.map((token) => [token.path.join("."), token]),
  );
  const darkValues = new Map(
    collect(dark).map((token) => [token.path.join("."), String(token.value)]),
  );
  const result: ComponentTokens = {};

  for (const token of lightTokens.filter(isComponentToken)) {
    const [namespace] = token.path;
    if (!namespace) {
      continue;
    }
    const lightValue = String(token.value);
    const darkValue = darkValues.get(token.path.join("."));
    const { references, expression } = resolveChain(token, byPath);
    const entry: ComponentToken = {
      name: cssVariable(token.path),
      light: lightValue,
      dark: darkValue !== lightValue ? darkValue : undefined,
      references: references.length > 0 ? references : undefined,
      expression,
    };
    (result[namespace] ??= []).push(entry);
  }

  return result;
};
