import type { FieldValues, UseFormReturn } from "react-hook-form";
import { createContext, useContext } from "react";

interface FormContext<F extends FieldValues> {
  form?: UseFormReturn<F>;
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFormContext = FormContext<any>;

export const formContext = createContext<AnyFormContext>({
  id: "default-form-id-" + Math.random().toString(36).slice(2),
});

export const FormContextProvider = formContext.Provider;

export const useFormContext = <F extends FieldValues>(): FormContext<F> =>
  useContext(formContext) as FormContext<F>;
