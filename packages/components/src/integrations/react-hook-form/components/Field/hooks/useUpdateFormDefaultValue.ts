import type { FieldProps } from "@/integrations/react-hook-form/components/Field/Field";
import { useLayoutEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export const useUpdateFormDefaultValue = <T extends FieldValues>(
  fieldProps: FieldProps<T>,
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
