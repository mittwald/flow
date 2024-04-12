import type { ComponentProps, PropsWithChildren } from "react";
import React from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { FormContextProvider } from "@/integrations/react-hook-form/components/context/formContext";

interface Props<F extends FieldValues>
  extends ComponentProps<"form">,
    PropsWithChildren {
  form?: UseFormReturn<F>;
}

export function Form<F extends FieldValues>(props: Props<F>) {
  const { form, children, ...formProps } = props;

  return (
    <FormContextProvider value={{ form }}>
      <form {...formProps}>{children}</form>
    </FormContextProvider>
  );
}
