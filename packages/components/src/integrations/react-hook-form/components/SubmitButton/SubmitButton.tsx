import type { ActionProps } from "@/components/Action";
import { type ButtonProps } from "@/components/Button";
import FormAction from "@/integrations/react-hook-form/components/FormAction";
import ButtonView from "@/views/ButtonView";
import type { FC } from "react";

type SupportedActionProps = Pick<ActionProps, "showFeedback">;

export type SubmitButtonProps = ButtonProps & SupportedActionProps;

export const SubmitButton: FC<SubmitButtonProps> = (props) => {
  const { showFeedback, ...buttonProps } = props;
  return (
    <FormAction submit showFeedback={showFeedback}>
      <ButtonView {...buttonProps} />
    </FormAction>
  );
};

export default SubmitButton;
