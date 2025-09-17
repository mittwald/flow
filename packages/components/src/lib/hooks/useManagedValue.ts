import { useState } from "react";

interface MangedValueProps<V> {
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
}

export const useManagedValue = <T extends string>(
  props: MangedValueProps<T>,
  onChange = props.onChange,
) => {
  const { value: valueFromProps, defaultValue: defaultValueFromProps } = props;

  const isControlled = typeof valueFromProps !== "undefined";
  const hasDefaultValue = typeof defaultValueFromProps !== "undefined";

  const [internalValue, setInternalValue] = useState(
    hasDefaultValue ? defaultValueFromProps : "",
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
