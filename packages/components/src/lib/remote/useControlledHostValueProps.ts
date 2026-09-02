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
 * `emptyValue` is what the field reports while nothing has been entered – `""`
 * for a text input, `NaN` for a number, `null` for a date range. It keeps the
 * field on the controlled side of React's controlled/uncontrolled line for its
 * whole lifetime: the state below owns the value from the first change on, so
 * without it a field that starts with neither `value` nor `defaultValue` hands
 * react-aria `undefined` first and a real value afterwards.
 * `useControlledState` reads only `undefined` as uncontrolled and warns about
 * that transition – and the value changes owner mid-flight, from the DOM input
 * to this hook.
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
   * `undefined` is the only value that falls back, because it is the only one
   * react-aria reads as uncontrolled. `null` must not: it is how a caller
   * controls a `DateRangePicker` that has no range selected, so `??` would let
   * it fall through to `defaultValue`.
   *
   * The marker cannot appear on the first render — it is only sent once a
   * remote event has been handled — so `regularValue` is the caller's own value
   * here.
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
