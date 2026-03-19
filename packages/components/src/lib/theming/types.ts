import type tokens from "@mittwald/flow-design-tokens/json/all-light.json";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = Exclude<Theme, "system">;
export type DesignTokens = typeof tokens;
