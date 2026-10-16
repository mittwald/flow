import { getContext, setContext } from "svelte";

export type DeprecationWarningHandler = (message: string) => void;

const deprecationWarningKey = Symbol.for("flow.remote.svelte.deprecation");

export const setDeprecationWarningHandler = (
  handler: DeprecationWarningHandler,
): void => {
  setContext(deprecationWarningKey, handler);
};

/**
 * Warns once per message, in the console and to the provider.
 *
 * Deduplicated per call site, like Flow's hook: a component that warns on every
 * render must not fill the console.
 */
export const useWarnDeprecation = (): DeprecationWarningHandler => {
  const onWarning = getContext<DeprecationWarningHandler | undefined>(
    deprecationWarningKey,
  );
  const reported = new Set<string>();

  return (message) => {
    if (reported.has(message)) {
      return;
    }
    reported.add(message);
    console.warn(message);
    onWarning?.(message);
  };
};
