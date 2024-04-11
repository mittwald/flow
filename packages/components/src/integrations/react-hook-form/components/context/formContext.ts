import type { FieldValues, UseFormReturn } from "react-hook-form";
import { createContext, useContext } from "react";

interface FormContext<F extends FieldValues> {
  form?: UseFormReturn<F>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFormContext = FormContext<any>;

export const formContext = createContext<AnyFormContext>({});

export const FormContextProvider = formContext.Provider;

export const useFormContext = <F extends FieldValues>(): FormContext<F> =>
  useContext(formContext) as FormContext<F>;
