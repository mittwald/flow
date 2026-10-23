export const isStyleProp = (name: string): boolean => name === "style";

// React appends this declaration to an existing inline style when it suspends
export const isReactSuspendedStyle = (value: unknown): boolean =>
  typeof value === "string" && /display:\s*none\s*!important/.test(value);
