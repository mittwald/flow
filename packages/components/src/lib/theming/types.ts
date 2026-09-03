import type tokens from "@mittwald/flow-design-tokens/json-runtime/all-light.json";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = Exclude<Theme, "system">;
export type DesignTokens = typeof tokens;
