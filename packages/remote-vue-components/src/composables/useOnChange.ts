import { watch, type WatchSource } from "vue";

/**
 * Runs `callback` when `source` changes — Flow's `useOnChange`, which exists
 * because an effect with a dependency array also runs on the first render.
 * Vue's `watch` is lazy by default, so this is a thin naming layer.
 */
export const useOnChange = <T>(
  source: WatchSource<T>,
  callback: (value: T, previousValue: T) => void,
): void => {
  watch(source, (value, previousValue) => callback(value, previousValue));
};
