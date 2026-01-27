import type { UseFormReturn } from "react-hook-form";
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import type { ActionModel } from "@/components/Action/models/ActionModel";
import invariant from "invariant";
import { useFormSubmitAction } from "@/integrations/react-hook-form/components/FormContextProvider/useFormSubmitAction";

interface FormContext {
  form: UseFormReturn;
  id: string;
  isReadOnly: boolean;
  setReadOnly: Dispatch<SetStateAction<boolean>>;
  formSubmitAction: ActionModel;
}

export const FormContext = createContext<FormContext | undefined>(undefined);

export interface FormContextProviderProps extends PropsWithChildren {
  form: UseFormReturn;
  id: string;
  isReadOnly?: boolean;
}

export const FormContextProvider = (props: FormContextProviderProps) => {
  const { form, id, isReadOnly: isReadOnlyProp = false, children } = props;

  const [isReadOnlyState, setReadOnly] = useState(isReadOnlyProp);
  const isReadOnly = isReadOnlyProp || isReadOnlyState;

  const formSubmitAction = useFormSubmitAction({
    form,
    setReadOnly,
  });

  return (
    <FormContext
      value={{
        isReadOnly,
        setReadOnly,
        id,
        form,
        formSubmitAction,
      }}
    >
      {children}
    </FormContext>
  );
};

export const useFormContext = () => {
  const ctx = useOptionalFormContext();
  invariant(
    !!ctx,
    "Could not useFormContext() outside a Form, or multiple versions of Flow installed.",
  );
  return ctx;
};

export const useOptionalFormContext = () => useContext(FormContext);

export default FormContextProvider;
