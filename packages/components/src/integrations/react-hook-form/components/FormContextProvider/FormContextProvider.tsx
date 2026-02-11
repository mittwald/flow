import type { FieldValues, UseFormReturn } from "react-hook-form";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import invariant from "invariant";
import type { AfterFormSubmitCallback } from "@/integrations/react-hook-form/components/Form/Form";

interface FormContext<F extends FieldValues> {
  form: UseFormReturn<F>;
  id: string;
  isReadOnly: boolean;
  setReadOnly: Dispatch<SetStateAction<boolean>>;
  onAfterSuccessFeedback?: AfterFormSubmitCallback;
}

export const FormContext = createContext<FormContext<FieldValues> | undefined>(
  undefined,
);

export interface FormContextProviderProps extends PropsWithChildren {
  form: UseFormReturn;
  id: string;
  isReadOnly?: boolean;
  onAfterSuccessFeedback?: AfterFormSubmitCallback;
}

export const FormContextProvider = (props: FormContextProviderProps) => {
  const {
    form,
    id,
    isReadOnly: isReadOnlyProp = false,
    onAfterSuccessFeedback,
    children,
  } = props;
  const [isReadOnlyState, setReadOnly] = useState(isReadOnlyProp);
  const isReadOnly = isReadOnlyProp || isReadOnlyState;

  return (
    <FormContext
      value={{
        isReadOnly,
        setReadOnly,
        id,
        form,
        onAfterSuccessFeedback,
      }}
    >
      {children}
    </FormContext>
  );
};

export const useFormContext = <F extends FieldValues>() => {
  const ctx = useOptionalFormContext<F>();
  invariant(
    !!ctx,
    "Could not useFormContext() outside a Form, or multiple versions of Flow installed.",
  );
  return ctx;
};

export const useOptionalFormContext = <F extends FieldValues>() =>
  useContext(FormContext) as FormContext<F> | undefined;

export default FormContextProvider;
