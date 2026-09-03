import { type ButtonProps } from "@/components/Button";
import FormAction from "@/integrations/react-hook-form/components/FormAction";
import ButtonView from "@/views/ButtonView";
import type { FC } from "react";

export const ResetButton: FC<ButtonProps> = (props) => {
  return (
    <FormAction reset>
      <ButtonView {...props} />
    </FormAction>
  );
};

export default ResetButton;
