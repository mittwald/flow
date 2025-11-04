import { FormContextProvider } from "@/integrations/react-hook-form/components/context/formContext";
import {
  type ComponentProps,
  type ComponentType,
  type FormEvent,
  type FormEventHandler,
  type PropsWithChildren,
  useId,
  useMemo,
  useState,
} from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { FormProvider as RhfFormContextProvider } from "react-hook-form";
import { Action } from "@/components/Action";
import { useRegisterActionStateContext } from "@/integrations/react-hook-form/components/Form/lib/useRegisterActionStateContext";

export type FormOnSubmitHandler<F extends FieldValues> = SubmitHandler<F>;

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
  isReadOnly?: boolean;
}

const DefaultFormComponent: FormComponentType = (p) => <form {...p} />;

export function Form<F extends FieldValues>(props: FormProps<F>) {
  const {
    form,
    children,
    onSubmit,
    formComponent: FormView = DefaultFormComponent,
    isReadOnly: isReadOnlyFromProps,
    ...formProps
  } = props;

  const [readonlyContextState, setReadOnlyContextState] =
    useState(!!isReadOnlyFromProps);

  const isReadOnly = isReadOnlyFromProps || readonlyContextState;

  const formId = useId();
  const FormViewComponent = useMemo(() => FormView, [formId]);
  const { action, registerSubmitResult } = useRegisterActionStateContext(form);

  const handleOnSubmit = (e?: FormEvent<HTMLFormElement> | F) => {
    const { isSubmitting, isValidating } = form.control._formState;
    const formEvent =
      e && "nativeEvent" in e ? (e as FormEvent<HTMLFormElement>) : undefined;

    formEvent?.stopPropagation();

    if (isSubmitting || isValidating) {
      formEvent?.preventDefault();
      return;
    }

    form.handleSubmit((values) => {
      const result = onSubmit(values, formEvent);
      registerSubmitResult(result);
      return result;
    })(formEvent);
  };

  return (
    <RhfFormContextProvider {...form}>
      <FormContextProvider
        value={{
          form,
          id: formId,
          isReadOnly,
          setReadOnly: setReadOnlyContextState,
        }}
      >
        <Action actionModel={action}>
          <FormViewComponent
            {...formProps}
            id={formId}
            onSubmit={handleOnSubmit}
          >
            {children}
          </FormViewComponent>
        </Action>
      </FormContextProvider>
    </RhfFormContextProvider>
  );
}

export default Form;
