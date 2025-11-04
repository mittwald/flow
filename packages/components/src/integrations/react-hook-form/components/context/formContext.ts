import type { FieldValues, UseFormReturn } from "react-hook-form";
import { createContext, useContext, type Dispatch } from "react";
import invariant from "invariant";

interface FormContext<F extends FieldValues> {
  form: UseFormReturn<F>;
  id: string;
  isReadOnly: boolean;
  setReadOnly: Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFormContext = FormContext<any>;

export const formContext = createContext<AnyFormContext | undefined>(undefined);

export const FormContextProvider = formContext.Provider;

export const useFormContext = <F extends FieldValues>(): FormContext<F> => {
  const ctx = useContext(formContext);
  invariant(
    !!ctx,
    "Could not useFormContext() outside a Form, or multiple versions of Flow installed.",
  );
  return ctx;
};

export const useOptionalFormContext = <F extends FieldValues>() =>
  useContext(formContext) as FormContext<F> | undefined;
