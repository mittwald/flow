import { useState } from "react";

interface ManagedValuePropNames<K extends string> {
  value: K;
  defaultValue: K;
}

type PossibleValueProps<P> = Extract<
  keyof Omit<P, "onChange">,
  string | boolean
>;

export const useManagedValue = <
  P extends object,
  V = unknown,
  PDV extends PossibleValueProps<P> = PossibleValueProps<P>,
>(
  props: P & { onChange?: (value: V) => void },
  onChange = props.onChange,
  managedValuePropName: ManagedValuePropNames<PDV> = {
    value: "value" as PDV,
    defaultValue: "defaultValue" as PDV,
  },
) => {
  const valueFromProps = props[managedValuePropName.value] as V;
  const defaultValueFromProps = props[managedValuePropName.defaultValue] as V;

  const isControlled = typeof valueFromProps !== "undefined";
  const hasDefaultValue = typeof defaultValueFromProps !== "undefined";

  const [internalValue, setInternalValue] = useState(
    hasDefaultValue ? defaultValueFromProps : valueFromProps,
  );
  const value = isControlled ? valueFromProps : internalValue;

  const handleOnChange = (value: V) => {
    onChange?.(value);

    if (!isControlled) {
      setInternalValue(() => value);
    }
  };

  return { value, handleOnChange } as const;
};
