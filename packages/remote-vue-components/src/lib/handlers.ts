// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type AnyHandler = Function;

/** Whether a prop key is an event handler (`onPress`, `onOpenChange`). */
export const isHandlerKey = (key: string): boolean => /^on[A-Z]/.test(key);

/**
 * Every function in a handler value. Vue's `mergeProps` — and so `cloneVNode` —
 * combines two handlers for one key into an array, and nests them when it
 * merges again.
 */
export const flattenHandlers = (value: unknown): AnyHandler[] =>
  Array.isArray(value)
    ? value.flatMap(flattenHandlers)
    : typeof value === "function"
      ? [value as AnyHandler]
      : [];

/** Calls every handler in `value` with the same arguments, in order. */
export const callHandlers = (value: unknown, ...args: unknown[]): void => {
  for (const handler of flattenHandlers(value)) {
    handler(...args);
  }
};
