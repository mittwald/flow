import type { FieldValues, UseFormReturn } from "react-hook-form";
import {
  createContext,
  useContext,
  type Dispatch,
  type FormEvent,
  type RefObject,
  type SetStateAction,
} from "react";
import invariant from "invariant";
import type { ActionModel } from "@/components/Action/models/ActionModel";

interface FormContext<F extends FieldValues> {
  form: UseFormReturn<F>;
  id: string;
  ref: RefObject<HTMLFormElement | null>;
  isReadOnly: boolean;
  setReadOnly: Dispatch<SetStateAction<boolean>>;
  submitButtonRef: RefObject<HTMLButtonElement | null>;
  submit: (e?: FormEvent<HTMLFormElement> | F) => void;
  formActionModel: ActionModel;
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
