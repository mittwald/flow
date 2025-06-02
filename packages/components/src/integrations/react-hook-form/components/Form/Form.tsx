import { SubmitButtonStateProvider } from "@/integrations/react-hook-form/components/ActionGroupWrapper/SubmitButtonStateProvider";
import { FormContextProvider } from "@/integrations/react-hook-form/components/context/formContext";
import type {
  ComponentProps,
  ComponentType,
  FormEvent,
  FormEventHandler,
  PropsWithChildren,
} from "react";
import { useId, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { FormProvider as RhfFormContextProvider } from "react-hook-form";
import { AfterFormSubmitEffect } from "../AfterFormSubmitEffect/AfterFormSubmitEffect";

export type FormOnSubmitHandler<F extends FieldValues> = Parameters<
  UseFormReturn<F>["handleSubmit"]
>[0];

type FormComponentType = ComponentType<
  PropsWithChildren<{
    id: string;
    onSubmit?: FormEventHandler | FormOnSubmitHandler<never>;
  }>
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
  const submitHandlerResultRef = useRef<unknown>(null);

  const handleOnSubmit = (e: FormEvent<HTMLFormElement> | F) => {
    const { isSubmitting, isValidating } = form.control._formState;
    const formEvent =
      "nativeEvent" in e ? (e as FormEvent<HTMLFormElement>) : undefined;

    formEvent?.stopPropagation();

    if (isSubmitting || isValidating) {
      formEvent?.preventDefault();
      return;
    }

    submitHandlerResultRef.current = undefined;

    form.handleSubmit((values) => {
      const result = onSubmit(values, formEvent);
      isAsyncSubmit.current = result instanceof Promise;
      submitHandlerResultRef.current = result;
      return result;
    })(formEvent);
  };

  return (
    <RhfFormContextProvider {...form}>
      <FormContextProvider value={{ form, id: formId }}>
        <SubmitButtonStateProvider isAsyncSubmit={isAsyncSubmit}>
          <FormView {...formProps} id={formId} onSubmit={handleOnSubmit}>
            {children}
          </FormView>
        </SubmitButtonStateProvider>
        <AfterFormSubmitEffect
          submitHandlerResultRef={submitHandlerResultRef}
        />
      </FormContextProvider>
    </RhfFormContextProvider>
  );
}

export default Form;
