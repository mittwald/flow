import Action from "@/components/Action";
import { useFormContext } from "@/integrations/react-hook-form/components/FormContextProvider";
import type { FC, PropsWithChildren } from "react";

export const FormSubmitAction: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const action = useFormContext().formSubmitAction;
  return <Action actionModel={action}>{children}</Action>;
};

export default FormSubmitAction;
