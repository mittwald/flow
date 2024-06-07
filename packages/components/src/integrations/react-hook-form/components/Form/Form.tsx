import type {
  ComponentProps,
  FormEventHandler,
  PropsWithChildren,
} from "react";
import { useEffect } from "react";
import React from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { useFormState } from "react-hook-form";
import { FormContextProvider } from "@/integrations/react-hook-form/components/context/formContext";
import { ActionStateContext } from "@/components/Action/ActionStateContext";

export type FormOnSubmitHandler<F extends FieldValues> = Parameters<
  UseFormReturn<F>["handleSubmit"]
>[0];

interface Props<F extends FieldValues>
  extends Omit<ComponentProps<"form">, "onSubmit">,
    PropsWithChildren {
  form: UseFormReturn<F>;
  onSubmit: FormOnSubmitHandler<F>;
}

export function Form<F extends FieldValues>(props: Props<F>) {
  const { form, children, onSubmit, ...formProps } = props;

  const { isValid, isSubmitted, isSubmitting, isSubmitSuccessful, errors } =
    useFormState(form);

  const unwatchedFormState = form.control._formState;

  useEffect(() => {
    if (isSubmitted && isValid) {
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
  }, [isSubmitted, isValid]);

  const handleOnSubmit: FormEventHandler = (e) => {
    if (unwatchedFormState.isSubmitting || unwatchedFormState.isValidating) {
      e.preventDefault();
    } else {
      form.handleSubmit(onSubmit)(e);
    }
  };

  const submitError = isSubmitted ? errors : undefined;
  const submitSucceeded = isSubmitted && isSubmitSuccessful;

  return (
    <FormContextProvider value={{ form }}>
      <form {...formProps} onSubmit={handleOnSubmit}>
        <ActionStateContext
          isStarted={isSubmitting}
          hasFailedWithError={submitError}
          hasSucceeded={submitSucceeded}
        >
          {children}
        </ActionStateContext>
      </form>
    </FormContextProvider>
  );
}
