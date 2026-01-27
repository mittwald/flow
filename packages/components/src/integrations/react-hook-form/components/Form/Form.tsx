import { useHotkeySubmit } from "@/integrations/react-hook-form/components/Form/useHotkeySubmit";
import { FormContextProvider } from "@/integrations/react-hook-form/components/FormContextProvider/FormContextProvider";
import {
  type ComponentProps,
  type FC,
  type FormEvent,
  type FormEventHandler,
  type PropsWithChildren,
  type Ref,
  useId,
  useMemo,
} from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { FormProvider as RhfFormContextProvider } from "react-hook-form";

export type FormOnSubmitHandler<F extends FieldValues> = SubmitHandler<F>;

type FormComponentType = FC<
  PropsWithChildren<{
    id: string;
    onSubmit?: FormEventHandler | FormOnSubmitHandler<never>;
    ref?: Ref<HTMLFormElement>;
  }>
>;

export interface FormProps<F extends FieldValues>
  extends Omit<ComponentProps<"form">, "onSubmit">, PropsWithChildren {
  form: UseFormReturn<F>;
  onSubmit: FormOnSubmitHandler<F>;
  formComponent?: FC<Omit<FormComponentType, "ref">>;
  isReadOnly?: boolean;
}

const DefaultFormComponent: FormComponentType = (p) => <form {...p} />;

export function Form<F extends FieldValues>(props: FormProps<F>) {
  const {
    form,
    children,
    onSubmit,
    formComponent = DefaultFormComponent,
    isReadOnly,
    ref,
    id: idProp,
    ...formProps
  } = props;

  const newFormId = useId();
  const formId = idProp ?? newFormId;
  const FormComponent = useMemo(() => formComponent, [formId]);

  const handleSubmit = (e?: FormEvent | F) => {
    const formEvent = e && "nativeEvent" in e ? (e as FormEvent) : undefined;
    formEvent?.stopPropagation();
    return form.handleSubmit(onSubmit)(formEvent);
  };

  const refWithHotkeySubmit = useHotkeySubmit({
    ref,
    handleSubmit,
  });

  return (
    <RhfFormContextProvider {...form}>
      <FormContextProvider
        form={form as UseFormReturn}
        isReadOnly={isReadOnly}
        id={formId}
      >
        <FormComponent
          {...formProps}
          ref={refWithHotkeySubmit}
          id={formId}
          onSubmit={handleSubmit}
        >
          {children}
        </FormComponent>
      </FormContextProvider>
    </RhfFormContextProvider>
  );
}

export default Form;
