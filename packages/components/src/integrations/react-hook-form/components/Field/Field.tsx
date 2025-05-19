import { useFormContext } from "@/integrations/react-hook-form/components/context/formContext";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import FieldErrorView from "@/views/FieldErrorView";
import type { PropsWithChildren } from "react";
import {
  useController,
  type ControllerProps,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

export interface FieldProps<T extends FieldValues>
  extends Omit<ControllerProps<T>, "render" | "control">,
    PropsWithChildren {}

export function Field<T extends FieldValues>(props: FieldProps<T>) {
  const { children, name, defaultValue, ...rest } = props;

  const formContext = useFormContext<T>();
  const form = formContext.form;

  const uncontrolledField = {
    field: form.register(name),
    fieldState: form.getFieldState(name),
  };
  const controlledField = useController(props);

  const buildFieldProps = (
    field: typeof uncontrolledField | typeof controlledField,
  ) => ({
    ...field.field,
    defaultValue,
    name,
    form: formContext.id,
    isRequired: !!rest.rules?.required,
    validationBehavior: "aria" as const,
    isInvalid: field.fieldState.invalid,
    onChange: (value: unknown) => {
      field.field.onChange({
        target: {
          value,
        },
      });
    },
    children: dynamic((p) => (
      <>
        {p.children}
        <FieldErrorView>{field.fieldState.error?.message}</FieldErrorView>
      </>
    )),
  });

  const uncontrolledProps = buildFieldProps(uncontrolledField);
  const controlledProps = buildFieldProps(controlledField);
  const controlledValue = controlledField.field.value;

  const propsContext: PropsContext = {
    SearchField: uncontrolledProps,
    TextField: uncontrolledProps,
    TextArea: uncontrolledProps,

    Checkbox: {
      ...controlledProps,
      isSelected: controlledValue,
    },
    CheckboxGroup: controlledProps,
    CheckboxButton: {
      ...controlledProps,
      isSelected: controlledValue,
    },
    FileField: controlledProps,
    NumberField: controlledProps,
    RadioGroup: controlledProps,
    Switch: {
      ...controlledProps,
      isSelected: controlledValue,
    },
    Select: {
      ...controlledProps,
      selectedKey: controlledValue,
    },
    Slider: controlledProps,
    DatePicker: controlledProps,
    DateRangePicker: controlledProps,
    TimeField: controlledProps,
    SegmentedControl: controlledProps,
    ComboBox: {
      ...controlledProps,
      defaultInputValue: controlledValue,
    },
  };

  return (
    <PropsContextProvider
      props={propsContext}
      dependencies={[controlledField.fieldState, uncontrolledField.fieldState]}
    >
      {children}
    </PropsContextProvider>
  );
}

export const typedField = <T extends FieldValues>(
  ignoredForm: UseFormReturn<T> | UseFormReturn<T>["control"],
): typeof Field<T> => Field;
