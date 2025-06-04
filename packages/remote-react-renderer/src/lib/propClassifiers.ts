export const isStyleProp = (name: string): boolean => name === "style";

export const isReactSuspendedStyle = (value: unknown): boolean =>
  value === "display: none !important;";
