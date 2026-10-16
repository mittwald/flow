import { flushSync } from "svelte";
import { describe, expect, test, vi } from "vitest";
import { useOnChange } from "./lifecycle.svelte.js";

/*
 * `useOnChange` exists because an effect also runs on the first render — in
 * React because of the dependency array, in Svelte because `$effect` runs once
 * after mount. Skipping that first run is the whole component, so it is the
 * whole test.
 */
describe("useOnChange", () => {
  test("does not run on the first pass, and runs on every change after", () => {
    const callback = vi.fn();

    const cleanup = $effect.root(() => {
      let value = $state(1);
      useOnChange(
        () => value,
        (...args) => callback(...args),
      );

      flushSync();
      expect(callback).not.toHaveBeenCalled();

      value = 2;
      flushSync();
      expect(callback).toHaveBeenCalledExactlyOnceWith(2, 1);

      value = 3;
      flushSync();
      expect(callback).toHaveBeenLastCalledWith(3, 2);
    });

    cleanup();
  });

  test("does not run when the value is reassigned to itself", () => {
    const callback = vi.fn();

    const cleanup = $effect.root(() => {
      let value = $state("a");
      useOnChange(
        () => value,
        () => callback(),
      );

      flushSync();
      value = "a";
      flushSync();
    });

    cleanup();
    expect(callback).not.toHaveBeenCalled();
  });
});
