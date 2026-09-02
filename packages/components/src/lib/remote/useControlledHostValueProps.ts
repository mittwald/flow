import { useLayoutEffect, useState } from "react";
import { controlledRemoteValueMarker } from "./useControlledRemoteValueProps";
import type { FieldProps } from "@/lib/remote/types";

/**
 * Returns props with controlled value handling for remote components. It works
 * by omitting values resulting from a remotely executed event handler. These
 * values are marked by the `controlledRemoteValueMarker`.
 *
 * This hook is only necessary for text inputs. If not used, the controlled
 * input value may be corrupted by interleaved host inputs and remote events.
 *
 * The mirrored value is what the field renders, so it also decides whether the
 * field is controlled — and it has to stay on one side of that line for the
 * field's whole life. react-stately's `useControlledState` reads only
 * `undefined` as uncontrolled, so a mirror that starts out `undefined` and
 * becomes defined with the first change flips the field from uncontrolled to
 * controlled, which React and react-aria warn about. `emptyValue` is what keeps
 * the mirror defined from the first render on, and only the caller can name it:
 * the empty value of a text input is `""`, of `NumberField` `NaN`, and of
 * `DateRangePicker` `null` — each one what react-stately falls back to when the
 * field is uncontrolled, so the rendered output is the same either way.
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
   * The marker cannot appear on the first render — it is only sent once a
   * remote event has been handled — so `regularValue` is the caller's own value
   * here. A caller that controls the value with `null` (`DateRangePicker`)
   * keeps it: only `undefined` falls back.
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
