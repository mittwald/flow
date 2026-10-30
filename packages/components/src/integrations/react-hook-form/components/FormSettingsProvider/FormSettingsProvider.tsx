import {
  createContext,
  useContext,
  type BaseSyntheticEvent,
  type PropsWithChildren,
} from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { FormOnSubmitHandler } from "../Form/Form";

export interface SubmitInterceptorContext<F extends FieldValues = FieldValues> {
  form: UseFormReturn<F>;
  /**
   * The submit event, if the form was submitted by one. Pass it on to `submit`
   * so the handler can read the pressed submit button
   * (`event.nativeEvent.submitter`).
   */
  event?: BaseSyntheticEvent;
}

export type SubmitInterceptor = <F extends FieldValues = FieldValues>(
  submit: FormOnSubmitHandler<F>,
  values: F,
  context: SubmitInterceptorContext<F>,
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
