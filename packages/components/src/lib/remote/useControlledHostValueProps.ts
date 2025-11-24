import { useLayoutEffect, useState } from "react";
import { controlledRemoteValueMarker } from "./useControlledRemoteValueProps";
import type { FieldProps } from "@/lib/remote/types";

/**
 * Returns props with controlled value handling for remote components. It works
 * by omitting values resulting from a remotely executed event handler. These
 * values are marked by the `controlledRemoteValueMarker`.
 *
 * This hook is noly necessary for text inputs. If not use the controlled input
 * value may be corrupted by interleaved host inputs and remote events.
 */
export const useControlledHostValueProps = <T, P>(props: FieldProps<T, P>) => {
  const {
    value: valueFromProps,
    onChange: onChangeFromProps,
    defaultValue,
  } = props;

  const regularValue =
    valueFromProps === controlledRemoteValueMarker ? undefined : valueFromProps;

  const [value, setValue] = useState(regularValue ?? defaultValue);

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
