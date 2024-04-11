import type { PropsWithChildren } from "react";
import React from "react";
import type {
  ControllerProps,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { Controller as RHFController } from "react-hook-form";
import type { PropsContext } from "@/lib/propsContext";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import { useFormContext } from "@/integrations/react-hook-form/components/context/formContext";
import { FieldError } from "@/components/FieldError";

interface Props<T extends FieldValues>
  extends Omit<ControllerProps<T>, "render">,
    PropsWithChildren {}

export function Controller<T extends FieldValues>(props: Props<T>) {
  const { children, control, ...rest } = props;

  const controlFromContext = useFormContext<T>().form?.control;

  return (
    <RHFController
      {...rest}
      control={control ?? controlFromContext}
      render={(renderProps) => {
        const { field, fieldState } = renderProps;

        const formControlProps = {
          ...field,
          isRequired: !!rest.rules?.required,
          isInvalid: fieldState.invalid,
          validationBehavior: "aria" as const,
          children: dynamic((p) => (
            <>
              {p.children}
              <FieldError>{fieldState.error?.message}</FieldError>
            </>
          )),
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

export const typedController = <T extends FieldValues>(
  ignoredForm: UseFormReturn<T>,
): typeof Controller<T> => Controller;
