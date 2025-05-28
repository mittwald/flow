import { useFormContext } from "@/integrations/react-hook-form/components/context/formContext";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithChildren } from "react";
import {
  useController,
  type ControllerProps,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import FieldErrorView from "@/views/FieldErrorView";

export interface FieldProps<T extends FieldValues>
  extends Omit<ControllerProps<T>, "render" | "control">,
    PropsWithChildren {}

export function Field<T extends FieldValues>(props: FieldProps<T>) {
  const { children, name, defaultValue, ...rest } = props;

  const controller = useController(props);
  const formContext = useFormContext<T>();
  const value = controller.field.value;

  const fieldProps = {
    ...controller.field,
    name,
    form: formContext.id,
    isRequired: !!rest.rules?.required,
    validationBehavior: "aria" as const,
    defaultValue,
    isInvalid: controller.fieldState.invalid,
    children: dynamic((p) => {
      if (controller.fieldState.invalid) {
        return (
          <>
            {p.children}
            <FieldErrorView>
              {controller.fieldState.error?.message}
            </FieldErrorView>
          </>
        );
      }

      return p.children;
    }),
  };

  const { value: ignoredValue, ...fieldPropsWithoutValue } = fieldProps;

  const propsContext: PropsContext = {
    SearchField: fieldProps,
    TextField: fieldProps,
    TextArea: fieldProps,

    Checkbox: {
      ...fieldProps,
      isSelected: value,
    },
    CheckboxGroup: fieldProps,
    CheckboxButton: {
      ...fieldProps,
      isSelected: value,
    },
    FileField: fieldProps,
    NumberField: fieldProps,
    RadioGroup: fieldProps,
    Switch: {
      ...fieldProps,
      isSelected: value,
    },
    Select: {
      ...fieldProps,
      selectedKey: value,
    },
    Slider: fieldProps,
    PasswordCreationField: fieldProps,
    DatePicker: fieldProps,
    DateRangePicker: fieldProps,
    TimeField: fieldProps,
    SegmentedControl: fieldProps,
    ComboBox: {
      ...fieldPropsWithoutValue,
      selectedKey: value,
    },
  };

  return (
    <PropsContextProvider
      props={propsContext}
      dependencies={[controller.fieldState, controller.field, value]}
    >
      {children}
    </PropsContextProvider>
  );
}

export const typedField = <T extends FieldValues>(
  ignoredForm: UseFormReturn<T> | UseFormReturn<T>["control"],
): typeof Field<T> => Field;

export default Field;
