import { createContext, useContext, type PropsWithChildren } from "react";
import type { FieldValues } from "react-hook-form";
import type { FormOnSubmitHandler } from "../Form/Form";

type SubmitInterceptor = <F extends FieldValues = FieldValues>(
  submit: FormOnSubmitHandler<F>,
  values: F,
) => ReturnType<FormOnSubmitHandler<F>>;

interface Context {
  submitInterceptor?: SubmitInterceptor;
}

const context = createContext<Context>({});

export type FormSettingsProviderProps = Context & PropsWithChildren;

export function FormSettingsProvider(props: FormSettingsProviderProps) {
  return (
    <context.Provider value={props as Context}>
      {props.children}
    </context.Provider>
  );
}

export const useFormSettings = () => useContext(context);
