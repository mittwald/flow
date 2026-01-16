import { type ButtonProps } from "@/components/Button";
import { useFormContext } from "@/integrations/react-hook-form/components/FormContextProvider";
import FormSubmitAction from "@/integrations/react-hook-form/components/FormSubmitAction";
import ButtonView from "@/views/ButtonView";
import type { FC } from "react";

export const SubmitButton: FC<ButtonProps> = (props) => {
  const { children, isReadOnly: isReadOnlyProp, ...rest } = props;

  const formContext = useFormContext();

  const isReadOnly = isReadOnlyProp || formContext.isReadOnly;

  return (
    <FormSubmitAction>
      <ButtonView
        {...rest}
        type="submit"
        form={formContext.id}
        isReadOnly={isReadOnly}
      >
        {children}
      </ButtonView>
    </FormSubmitAction>
  );
};

export default SubmitButton;
