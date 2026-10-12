import { partition } from "remeda";
import generatedTokens from "./componentTokens.generated.json";
import type { ComponentToken, ComponentTokens } from "./types";

const allTokens: ComponentTokens = generatedTokens;

/** `TextField` → `text-field`, the namespace convention of the token files */
export const componentNamespace = (componentName: string): string =>
  componentName
    .trim()
    .replaceAll(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replaceAll(/\s+/g, "-")
    .toLowerCase();

/**
 * `tokens="list, list-item"` overrides the namespace derived from the component
 * name. A string, because next-mdx-remote strips JS expressions like
 * `tokens={[…]}` from MDX.
 */
export const resolveNamespaces = (
  componentName: string,
  tokens?: string,
): string[] => {
  const namespaces = (tokens ?? "")
    .split(",")
    .map((namespace) => namespace.trim())
    .filter(Boolean);
  return namespaces.length > 0
    ? namespaces
    : [componentNamespace(componentName)];
};

export const hasNamespace = (namespace: string): boolean =>
  namespace in allTokens;

export const loadComponentTokens = (
  namespaces: readonly string[],
): ComponentToken[] =>
  namespaces.flatMap((namespace) => allTokens[namespace] ?? []);

export const isColor = (value: string): boolean =>
  /^(#[0-9a-f]{3,8}|rgba?\([^)]*\)|transparent)$/i.test(value);

/**
 * Colors, and anything else that differs between the themes, go in a table with
 * a column per theme; the rest in one with a single value.
 */
export const splitByTheme = (tokens: ComponentToken[]) => {
  const [perTheme, single] = partition(
    tokens,
    (token) => token.dark !== undefined || isColor(token.light),
  );
  return { single, perTheme };
};

/** Reads `tokens="…"` from a `<ComponentTokenTable />` tag. */
export const parseTokensAttribute = (tag: string): string | undefined =>
  /tokens=["']([^"']*)["']/.exec(tag)?.[1];
