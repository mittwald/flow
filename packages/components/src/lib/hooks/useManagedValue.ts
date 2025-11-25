import { useState } from "react";

type ManagedValueProps<V, P = object> = {
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
} & P;

export function useManagedValue<V, P = object>(props: ManagedValueProps<V, P>) {
  const {
    value: valueFromProps,
    defaultValue: defaultValueFromProps,
    onChange,
    ...restProps
  } = props;

  const isControlled = valueFromProps !== undefined;
  const hasDefaultValue = defaultValueFromProps !== undefined;

  const [internalValue, setInternalValue] = useState<V>(
    hasDefaultValue ? defaultValueFromProps! : valueFromProps!,
  );
  const value = isControlled ? valueFromProps : internalValue;

  const handleOnChange = (newValue: V) => {
    onChange?.(newValue);
    if (!isControlled) {
      setInternalValue(newValue);
    }
  };

  return { value, handleOnChange, ...restProps } as const;
}
