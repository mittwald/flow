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

export type EventModifier = "once" | "passive" | "capture";

export interface EventKey {
  event: string;
  modifiers: ReadonlySet<EventModifier>;
}

const modifierSuffix = /(Once|Passive|Capture)$/;

/**
 * The element event a v-on key listens to, and the modifiers Vue folded into
 * it: `@press.once` compiles to `onPressOnce`, `@click.capture.once` to
 * `onClickCaptureOnce` — `Once`, `Passive` and `Capture` in template order. An
 * exact event name wins, so React's own capture events (`clickCapture`) keep
 * their meaning, and `.capture` resolves to one where the element has it.
 * `undefined` when the key names no event of the element.
 */
export const resolveEventKey = (
  key: string,
  events: ReadonlyMap<string, unknown>,
): EventKey | undefined => {
  const [, initial, rest] = /^on([A-Z])(.*)$/.exec(key) ?? [];
  if (initial === undefined || rest === undefined) {
    return undefined;
  }
  let event = initial.toLowerCase() + rest;
  const modifiers = new Set<EventModifier>();

  while (!events.has(event)) {
    const [suffix] = modifierSuffix.exec(event) ?? [];
    if (suffix === undefined) {
      return undefined;
    }
    modifiers.add(suffix.toLowerCase() as EventModifier);
    event = event.slice(0, -suffix.length);
  }

  if (modifiers.has("capture") && events.has(`${event}Capture`)) {
    modifiers.delete("capture");
    event = `${event}Capture`;
  }

  return { event, modifiers };
};
