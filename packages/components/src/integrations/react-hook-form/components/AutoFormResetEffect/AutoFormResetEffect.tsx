import type { FC } from "react";
import { useEffect } from "react";
import { useFormContext } from "~/integrations/react-hook-form/components/context/formContext";
import { useFormState } from "react-hook-form";

/**
 * This effect has its own component to prevent unnecessary re-renders of the
 * entire form when the form state changes (useFormState).
 */
export const AutoFormResetEffect: FC = () => {
  const form = useFormContext().form;
  const { isValid, isSubmitted } = useFormState(form);

  useEffect(() => {
    if (isSubmitted && isValid && form) {
      form.reset(undefined, {
        keepIsSubmitted: false,
        keepIsSubmitSuccessful: false,
        keepDefaultValues: true,
        keepValues: true,
        keepDirtyValues: true,
        keepIsValid: true,
        keepDirty: true,
        keepErrors: true,
        keepTouched: true,
        keepIsValidating: true,
        keepSubmitCount: true,
      });
    }
  }, [isSubmitted, isValid, form]);

  return null;
};
