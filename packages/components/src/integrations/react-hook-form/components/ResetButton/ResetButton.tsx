import { type ButtonProps } from "@/components/Button";
import { useFormContext } from "@/integrations/react-hook-form/components/FormContextProvider";
import ButtonView from "@/views/ButtonView";
import type { FC } from "react";
import type { PressEvent } from "react-aria";

export const ResetButton: FC<ButtonProps> = (props) => {
  const { children, onPress, isReadOnly: isReadOnlyProp, ...rest } = props;

  const formContext = useFormContext();

  const isReadOnly = isReadOnlyProp || formContext.isReadOnly;

  const handleOnPress = (e: PressEvent) => {
    formContext.form.reset();
    onPress?.(e);
  };

  return (
    <ButtonView
      color="secondary"
      variant="soft"
      {...rest}
      type="button"
      onPress={handleOnPress}
      isReadOnly={isReadOnly}
    >
      {children}
    </ButtonView>
  );
};

export default ResetButton;
