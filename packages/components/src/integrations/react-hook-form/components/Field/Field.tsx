import { useFormContext } from "@/integrations/react-hook-form/components/context/formContext";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import FieldErrorView from "@/views/FieldErrorView";
import type { PropsWithChildren } from "react";
import {
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

  const field = form.register(name);
  const { invalid, error } = form.getFieldState(name);

  const value = form.watch(name);

  const uncontrolledProps = {
    ...field,
    defaultValue,
    name,
    form: formContext.id,
    isRequired: !!rest.rules?.required,
    isInvalid: invalid,
    validationBehavior: "aria" as const,
    children: dynamic((p) => (
      <>
        {p.children}
        <FieldErrorView>{error?.message}</FieldErrorView>
      </>
    )),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (value: any) => {
      form.setValue(name, value);
    },
  };

  const formControlProps = {
    ...uncontrolledProps,
    value,
  };

  const propsContext: PropsContext = {
    SearchField: uncontrolledProps,
    TextField: uncontrolledProps,
    TextArea: uncontrolledProps,

    Checkbox: {
      ...formControlProps,
      isSelected: formControlProps.value,
    },
    CheckboxGroup: formControlProps,
    CheckboxButton: {
      ...formControlProps,
      isSelected: formControlProps.value,
    },
    FileField: formControlProps,
    NumberField: formControlProps,
    RadioGroup: formControlProps,
    Switch: {
      ...formControlProps,
      isSelected: formControlProps.value,
    },
    Select: {
      ...formControlProps,
      selectedKey: formControlProps.value,
    },
    Slider: formControlProps,
    DatePicker: formControlProps,
    DateRangePicker: formControlProps,
    TimeField: formControlProps,
    SegmentedControl: formControlProps,
    ComboBox: {
      ...formControlProps,
      defaultInputValue: formControlProps.value,
    },
  };

  return (
    <PropsContextProvider props={propsContext} dependencies={[value]}>
      {children}
    </PropsContextProvider>
  );
}

export const typedField = <T extends FieldValues>(
  ignoredForm: UseFormReturn<T>,
): typeof Field<T> => Field;
