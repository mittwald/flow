import type {
  ComponentProps,
  ComponentType,
  FormEventHandler,
  PropsWithChildren,
} from "react";
import { useId } from "react";
import React, { useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { FormContextProvider } from "@/integrations/react-hook-form/components/context/formContext";
import { SubmitButtonStateProvider } from "@/integrations/react-hook-form/components/ActionGroupWrapper/SubmitButtonStateProvider";
import { AutoFormResetEffect } from "../AutoFormResetEffect/AutoFormResetEffect";

export type FormOnSubmitHandler<F extends FieldValues> = Parameters<
  UseFormReturn<F>["handleSubmit"]
>[0];

export interface FormProps<F extends FieldValues = Record<string, unknown>>
  extends Omit<ComponentProps<"form">, "onSubmit">,
    PropsWithChildren {
  form: UseFormReturn<F>;
  onSubmit: FormOnSubmitHandler<F>;
  formComponent?: ComponentType<ComponentProps<"form">>;
}

function BasicForm<F extends FieldValues>(
  props: FormProps<F>,
  ref: React.ForwardedRef<HTMLFormElement>,
) {
  const {
    form,
    children,
    onSubmit,
    formComponent: FormView = (p) => <form {...p} />,
    ...formProps
  } = props;

  const formId = useId();
  const isAsyncSubmit = useRef(false);

  const handleOnSubmit: FormEventHandler = (e) => {
    const { isSubmitting, isValidating } = form.control._formState;

    e.stopPropagation();

    if (isSubmitting || isValidating) {
      e.preventDefault();
      return;
    }

    form.handleSubmit((values) => {
      const result = onSubmit(values, e);
      isAsyncSubmit.current = result instanceof Promise;
      return result;
    })(e);
  };

  return (
    <FormContextProvider value={{ form, id: formId }}>
      <SubmitButtonStateProvider isAsyncSubmit={isAsyncSubmit}>
        <FormView
          {...formProps}
          id={formId}
          ref={ref}
          onSubmit={handleOnSubmit}
        >
          {children}
        </form>
        <AutoFormResetEffect />
      </SubmitButtonStateProvider>
    </FormContextProvider>
  );
}

export const Form = React.forwardRef(BasicForm);
