import type { ActionProps } from "@/components/Action/types";
import { FormResetAction } from "@/integrations/react-hook-form/components/FormAction/FormResetAction";
import FormSubmitAction from "@/integrations/react-hook-form/components/FormAction/FormSubmitAction";
import type { FC, PropsWithChildren } from "react";

type SupportedActionProps = Pick<ActionProps, "showFeedback">;

export interface FormActionProps
  extends PropsWithChildren, SupportedActionProps {
  reset?: boolean;
  submit?: boolean;
}

export const FormAction: FC<FormActionProps> = (props) => {
  const { children, reset, submit, ...actionProps } = props;

  if (submit) {
    return <FormSubmitAction {...actionProps}>{children}</FormSubmitAction>;
  }

  if (reset) {
    return <FormResetAction {...actionProps}>{children}</FormResetAction>;
  }

  return <>{children}</>;
};

export default FormAction;
