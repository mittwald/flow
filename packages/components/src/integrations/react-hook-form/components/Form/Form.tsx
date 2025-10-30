import { FormContextProvider } from "@/integrations/react-hook-form/components/context/formContext";
import {
  type ComponentProps,
  type ComponentType,
  type FormEvent,
  type FormEventHandler,
  type PropsWithChildren,
  useId,
  useMemo,
} from "react";
import type {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { FormProvider as RhfFormContextProvider } from "react-hook-form";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { Action } from "@/components/Action";
import { useRegisterActionStateContext } from "@/integrations/react-hook-form/components/Form/lib/useRegisterActionStateContext";
import { inheritProps } from "@/lib/propsContext/inherit/types";

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
    isReadOnly,
    ...formProps
  } = props;

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

  const readonlyPropsContext = {
    ...inheritProps,
    isReadOnly,
  } as const;

  const propsContext: PropsContext = {
    SearchField: readonlyPropsContext,
    TextField: readonlyPropsContext,
    TextArea: readonlyPropsContext,
    MarkdownEditor: readonlyPropsContext,
    Checkbox: readonlyPropsContext,
    CheckboxGroup: readonlyPropsContext,
    CheckboxButton: readonlyPropsContext,
    FileField: readonlyPropsContext,
    FileDropZone: readonlyPropsContext,
    NumberField: readonlyPropsContext,
    RadioGroup: readonlyPropsContext,
    Switch: readonlyPropsContext,
    Slider: readonlyPropsContext,
    PasswordCreationField: readonlyPropsContext,
    DatePicker: readonlyPropsContext,
    DateRangePicker: readonlyPropsContext,
    TimeField: readonlyPropsContext,
    SegmentedControl: readonlyPropsContext,
    Select: readonlyPropsContext,
    ComboBox: readonlyPropsContext,
    Button: readonlyPropsContext,
  };

  return (
    <PropsContextProvider props={propsContext} dependencies={[isReadOnly]}>
      <RhfFormContextProvider {...form}>
        <FormContextProvider value={{ form, id: formId }}>
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
    </PropsContextProvider>
  );
}

export default Form;
