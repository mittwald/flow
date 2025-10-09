import { useState } from "react";

interface ManagedValuePropNames<K extends string> {
  value: K;
  defaultValue: K;
}

export const useManagedValue = <P extends object, T = unknown>(
  props: P & { onChange?: (value: T) => void },
  onChange = props.onChange,
  managedValuePropName: ManagedValuePropNames<
    Extract<keyof Omit<P, "onChange">, string>
  > = {
    value: "value" as Extract<keyof Omit<P, "onChange">, string>,
    defaultValue: "defaultValue" as Extract<keyof Omit<P, "onChange">, string>,
  },
) => {
  const valueFromProps = props[managedValuePropName.value] as T;
  const defaultValueFromProps = props[managedValuePropName.defaultValue] as T;

  const isControlled = typeof valueFromProps !== "undefined";
  const hasDefaultValue = typeof defaultValueFromProps !== "undefined";

  const [internalValue, setInternalValue] = useState(
    hasDefaultValue ? defaultValueFromProps : valueFromProps,
  );
  const value = isControlled ? valueFromProps : internalValue;

  const handleOnChange = (value: T) => {
    onChange?.(value);

    if (!isControlled) {
      setInternalValue(() => value);
    }
  };

  return { value, handleOnChange } as const;
};
