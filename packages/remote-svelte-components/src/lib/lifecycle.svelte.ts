import { onMount } from "svelte";
import type { ReactiveValue } from "./remoteContext.svelte.js";

/**
 * Whether the component has mounted — the client-only guard, and the same thing
 * `BrowserOnly` uses.
 *
 * Flow exports it because a remote app is often hosted by a server-rendered
 * page (Next, SvelteKit) whose first render must not include a subtree.
 */
export const useIsMounted = (): ReactiveValue<boolean> => {
  let isMounted = $state(false);

  onMount(() => {
    isMounted = true;
  });

  return {
    get current() {
      return isMounted;
    },
  };
};

/**
 * Runs `callback` when `value` changes — Flow's `useOnChange`, which exists
 * because a React effect with a dependency array also runs on the first
 * render.
 *
 * A Svelte `$effect` has the same problem, so the first run is skipped here.
 * Has to be called while a component initializes.
 */
export const useOnChange = <T>(
  value: () => T,
  callback: (current: T, previous: T) => void,
): void => {
  let previous: T | undefined;
  let hasRun = false;

  $effect(() => {
    const current = value();

    if (!hasRun) {
      hasRun = true;
      previous = current;
      return;
    }

    const before = previous as T;
    previous = current;
    callback(current, before);
  });
};
