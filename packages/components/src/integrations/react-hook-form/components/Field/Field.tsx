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
import { FieldError } from "@/components/FieldError";

interface Props<T extends FieldValues>
  extends Omit<ControllerProps<T>, "render">,
    PropsWithChildren {}

export function Field<T extends FieldValues>(props: Props<T>) {
  const { children, control, ...rest } = props;

  const controlFromContext = useFormContext<T>().form?.control;

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
          isRequired: !!rest.rules?.required,
          isInvalid: invalid,
          validationBehavior: "aria" as const,
          children: dynamic((p) => (
            <>
              {p.children}
              <FieldError>{error?.message}</FieldError>
            </>
          )),
          ref: undefined,
          refProp: field.ref,
        };

        const propsContext: PropsContext = {
          Checkbox: formControlProps,
          CheckboxGroup: formControlProps,
          CheckboxButton: formControlProps,
          NumberField: formControlProps,
          RadioGroup: formControlProps,
          Switch: formControlProps,
          TextArea: formControlProps,
          TextField: formControlProps,
          Select: {
            ...formControlProps,
            defaultSelectedKey: formControlProps.value,
          },
          Slider: formControlProps,
          DatePicker: formControlProps,
          DateRangePicker: formControlProps,
          TimeField: formControlProps,
          SegmentedControl: formControlProps,
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
