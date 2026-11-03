import { getProperty } from "dot-prop";

export interface DesignToken {
  path: string[];
  value: string;
}

export const tokenName = (token: DesignToken): string => token.path.join("--");

const isDesignToken = (ref: unknown): ref is DesignToken =>
  typeof ref === "object" && ref !== null && "path" in ref && "value" in ref;

const collect = (
  current: unknown,
  collector: DesignToken[] = [],
): DesignToken[] => {
  if (isDesignToken(current)) {
    collector.push(current);
  } else if (current !== null && typeof current === "object") {
    for (const value of Object.values(current)) {
      collect(value, collector);
    }
  }
  return collector;
};

export const collectTokensInPath = (
  path: string,
  tokens: unknown,
): DesignToken[] =>
  collect(getProperty<unknown, string>(tokens, path, undefined));

export interface ThemedToken {
  name: string;
  light: string;
  /** Only set when it differs from `light` */
  dark?: string;
}

const collectInPaths = (paths: string, tokens: unknown) =>
  paths
    .split(",")
    .map((path) => path.trim())
    .filter(Boolean)
    .flatMap((path) => collectTokensInPath(path, tokens));

/**
 * The tokens of one or more comma-separated paths with their value per theme.
 * Brand tokens are theme-neutral, so only Semantic tokens and their consumers
 * carry `dark`.
 */
export const collectThemedTokens = (
  paths: string,
  light: unknown,
  dark: unknown,
): ThemedToken[] => {
  const darkValues = new Map(
    collectInPaths(paths, dark).map((token) => [tokenName(token), token.value]),
  );
  return collectInPaths(paths, light).map((token) => {
    const name = tokenName(token);
    const darkValue = darkValues.get(name);
    return {
      name,
      light: token.value,
      dark: darkValue !== token.value ? darkValue : undefined,
    };
  });
};

export const differsByTheme = (tokens: ThemedToken[]): boolean =>
  tokens.some((token) => token.dark !== undefined);
