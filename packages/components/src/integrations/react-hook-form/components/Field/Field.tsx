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
  extends Omit<ControllerProps<T>, "render">,
    PropsWithChildren {}

export function Field<T extends FieldValues>(props: FieldProps<T>) {
  const { children, name, defaultValue, ...rest } = props;

  const controller = useController(props);
  const formContext = useFormContext<T>();
  /**
   * We don't use controller.field.value here, because it doesn't update when
   * the form value is updated outside of this field (e.g. when setting values
   * with form.setValue or resetting the form), and the Field unmounts in
   * between. This is generally a feature of React Hook Form, but this breaks
   * dynamic forms where fields are conditionally rendered.
   *
   * By using formContext.form.watch(name), we ensure that the field value is
   * always in sync with the form state. See:
   * https://react-hook-form.com/api/usecontroller/controller/
   */
  const value = formContext.form.watch(name) ?? controller.field.value;

  const fieldProps = {
    ...controller.field,
    value,
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
    MarkdownEditor: fieldProps,

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
    FileDropZone: fieldProps,
    NumberField: fieldProps,
    RadioGroup: fieldProps,
    Switch: {
      ...fieldProps,
      isSelected: value,
    },
    Slider: fieldProps,
    PasswordCreationField: fieldProps,
    DatePicker: fieldProps,
    DateRangePicker: fieldProps,
    TimeField: fieldProps,
    SegmentedControl: fieldProps,
    Select: {
      ...fieldProps,
      selectedKey: value,
    },
    ComboBox: {
      ...fieldPropsWithoutValue,
      selectedKey: value,
    },
  };

  return (
    <PropsContextProvider
      mergeInParentContext
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
