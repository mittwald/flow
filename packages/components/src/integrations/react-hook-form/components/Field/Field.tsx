import type { PropsWithChildren } from "react";
import React from "react";
import type {
  ControllerProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { useFormContext } from "@/integrations/react-hook-form/components/context/formContext";
import FieldErrorView from "@/views/FieldErrorView";

export interface FieldProps<T extends FieldValues>
  extends Omit<ControllerProps<T>, "render">,
    PropsWithChildren {}

export function Field<T extends FieldValues>(props: FieldProps<T>) {
  const { children, control, ...rest } = props;

  const formContext = useFormContext<T>();
  const controlFromContext = formContext.form?.control;

  return (
    <Controller
      {...rest}
      control={control ?? controlFromContext}
      render={(renderProps) => {
        const {
          field,
          fieldState: { error, invalid },
        } = renderProps;

        const formControlProps = {
          ...field,
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
        };

        const propsContext: PropsContext = {
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
          TextArea: formControlProps,
          TextField: formControlProps,
          Select: {
            ...formControlProps,
            selectedKey: formControlProps.value,
          },
          Slider: formControlProps,
          DatePicker: formControlProps,
          DateRangePicker: formControlProps,
          TimeField: formControlProps,
          SegmentedControl: formControlProps,
          ComboBox: formControlProps,
          SearchField: formControlProps,
        };

        return (
          <PropsContextProvider
            props={propsContext}
            dependencies={[renderProps]}
          >
            {children}
          </PropsContextProvider>
        );
      }}
    />
  );
}

export const typedField = <T extends FieldValues>(
  ignoredForm: UseFormReturn<T>,
): typeof Field<T> => Field;
