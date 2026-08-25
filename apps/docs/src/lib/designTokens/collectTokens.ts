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
