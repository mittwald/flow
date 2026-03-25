import type { FieldProps } from "@/integrations/react-hook-form/components/Field/Field";
import { useLayoutEffect } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

export const useUpdateFormDefaultValue = <
  T extends FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>(
  fieldProps: FieldProps<T, TName>,
  form: UseFormReturn<T>,
) => {
  const { defaultValue, name } = fieldProps;

  useLayoutEffect(() => {
    if (defaultValue !== undefined) {
      form.resetField(name, {
        defaultValue,
        keepDirty: true,
        keepError: true,
        keepTouched: true,
      });
    }
  }, [form, defaultValue, name]);
};
