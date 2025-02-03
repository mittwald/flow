import type {
  ComponentProps,
  ComponentType,
  FormEventHandler,
  PropsWithChildren,
} from "react";
import { useId } from "react";
import React, { useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { FormProvider as RhfFormContextProvider } from "react-hook-form";
import { FormContextProvider } from "@/integrations/react-hook-form/components/context/formContext";
import { SubmitButtonStateProvider } from "@/integrations/react-hook-form/components/ActionGroupWrapper/SubmitButtonStateProvider";
import { AutoFormResetEffect } from "../AutoFormResetEffect/AutoFormResetEffect";

export type FormOnSubmitHandler<F extends FieldValues> = Parameters<
  UseFormReturn<F>["handleSubmit"]
>[0];

type FormComponentType = ComponentType<
  PropsWithChildren<{ id: string; onSubmit?: FormEventHandler }>
>;

export interface FormProps<F extends FieldValues>
  extends Omit<ComponentProps<"form">, "onSubmit">,
    PropsWithChildren {
  form: UseFormReturn<F>;
  onSubmit: FormOnSubmitHandler<F>;
  formComponent?: FormComponentType;
}

const DefaultFormComponent: FormComponentType = (p) => <form {...p} />;

export function Form<F extends FieldValues>(props: FormProps<F>) {
  const {
    form,
    children,
    onSubmit,
    formComponent: FormView = DefaultFormComponent,
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
    <RhfFormContextProvider {...form}>
      <FormContextProvider value={{ form, id: formId }}>
        <SubmitButtonStateProvider isAsyncSubmit={isAsyncSubmit}>
          <FormView {...formProps} id={formId} onSubmit={handleOnSubmit}>
            {children}
          </FormView>
          <AutoFormResetEffect />
        </SubmitButtonStateProvider>
      </FormContextProvider>
    </RhfFormContextProvider>
  );
}
