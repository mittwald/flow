import { useLayoutEffect, useState } from "react";
import { controlledRemoteValueMarker } from "./useControlledRemoteValueProps";
import type { FieldProps } from "@/lib/remote/types";

/**
 * Returns props with controlled value handling for remote components. It works
 * by omitting values resulting from a remotely executed event handler. These
 * values are marked by the `controlledRemoteValueMarker`.
 *
 * This hook is only necessary for text inputs. If not used the controlled input
 * value may be corrupted by interleaved host inputs and remote events.
 *
 * @param emptyValue What the field reports while nothing has been entered —
 *   `""` for a text input, `NaN` for a number, `null` for a date range. It is
 *   the sentinel that keeps the field controlled from the first render; see
 *   that convention in the package's AGENTS.md.
 */
export const useControlledHostValueProps = <T, P>(
  props: FieldProps<T, P>,
  emptyValue: T,
) => {
  const {
    value: valueFromProps,
    onChange: onChangeFromProps,
    defaultValue,
  } = props;

  const regularValue =
    valueFromProps === controlledRemoteValueMarker ? undefined : valueFromProps;

  /*
   * Only `undefined` falls back, because only `undefined` reads as
   * uncontrolled: a caller-supplied `null` controls a `DateRangePicker` with no
   * range selected, so `??` would swallow it. The marker cannot appear on the
   * first render, so `regularValue` is the caller's own value here.
   */
  const [value, setValue] = useState(
    regularValue !== undefined
      ? regularValue
      : defaultValue !== undefined
        ? defaultValue
        : emptyValue,
  );

  useLayoutEffect(() => {
    if (regularValue !== undefined) {
      setValue(regularValue);
    }
  }, [valueFromProps]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (v: any) => {
    setValue(v);
    onChangeFromProps?.(v);
  };

  return {
    ...props,
    value,
    onChange,
  };
};
