import type {
  ComponentProps,
  FormEventHandler,
  PropsWithChildren,
} from "react";
import React, { useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { FormContextProvider } from "@/integrations/react-hook-form/components/context/formContext";
import { SubmitButtonStateProvider } from "@/integrations/react-hook-form/components/ActionGroupWrapper/SubmitButtonStateProvider";
import { AutoFormResetEffect } from "../AutoFormResetEffect/AutoFormResetEffect";

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
    <FormContextProvider value={{ form }}>
      <SubmitButtonStateProvider isAsyncSubmit={isAsyncSubmit}>
        <form {...formProps} onSubmit={handleOnSubmit}>
          {children}
        </form>
        <AutoFormResetEffect />
      </SubmitButtonStateProvider>
    </FormContextProvider>
  );
}
