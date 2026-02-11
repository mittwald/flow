import { useEffect } from "react";
import type { FieldValues, FormState } from "react-hook-form";

interface Options {
  formState: FormState<FieldValues>;
  setReadOnly: (isReadOnly: boolean) => void;
}

export const useUpdateReadOnly = (options: Options) => {
  const { formState, setReadOnly } = options;

  const { isSubmitting } = formState;

  useEffect(() => {
    setReadOnly(isSubmitting);
  }, [isSubmitting, setReadOnly]);
};
