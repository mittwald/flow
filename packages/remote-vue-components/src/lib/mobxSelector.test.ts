import { watchMobxValue } from "@/lib/mobxSelector";
import { ListLoaderState } from "@mittwald/flow-components-base";
import { describe, expect, test } from "vitest";
import { effectScope } from "vue";

/*
 * The proof that `@mittwald/flow-components-base` is framework-agnostic: the
 * same class React's `IncrementalLoaderState` extends, read here through Vue's
 * reactivity and nothing else. If the core ever grows a React import, this test
 * is what fails.
 */
describe("watchMobxValue", () => {
  const inScope = <T>(run: () => T): { result: T; stop: () => void } => {
    const scope = effectScope();
    const result = scope.run(run) as T;
    return { result, stop: () => scope.stop() };
  };

  test("has the value before it returns", () => {
    const state = new ListLoaderState<string>();
    state.setDataBatch(0, ["a"]);

    const { result, stop } = inScope(() =>
      watchMobxValue(() => state.mergedData),
    );

    expect(result.value).toEqual(["a"]);
    stop();
  });

  test("follows the shared state as it changes", () => {
    const state = new ListLoaderState<string>();
    const { result, stop } = inScope(() =>
      watchMobxValue(() => state.isLoading),
    );

    expect(result.value).toBe(true);

    state.setBatchLoadingState(0, "loaded");
    expect(result.value).toBe(false);

    stop();
  });

  test("stops following once the scope is gone", () => {
    const state = new ListLoaderState<string>();
    const { result, stop } = inScope(() =>
      watchMobxValue(() => state.mergedData.length),
    );

    stop();
    state.setDataBatch(0, ["a"]);

    expect(result.value).toBe(0);
  });

  /*
   * Outside a scope nothing would ever stop the subscription, and the caller
   * gets a ref rather than a stopper — so there is no way to clean up after it.
   */
  test("refuses to run without a scope", () => {
    const state = new ListLoaderState<string>();

    expect(() => watchMobxValue(() => state.isLoading)).toThrow(/effectScope/);
  });
});
