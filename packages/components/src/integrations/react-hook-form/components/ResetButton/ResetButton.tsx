import { Button, type ButtonProps } from "@/components/Button";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useFormContext } from "@/integrations/react-hook-form";
import { type FC, useMemo } from "react";

export type ResetButtonProps = Omit<
  ButtonProps,
  "isFailed" | "isSucceeded" | "isPending" | "isReadOnly" | "type"
> & {
  buttonComponent?: FC<Omit<ButtonProps, "ref">>;
};

export const ResetButton = flowComponent("ResetButton", (props) => {
  const {
    children,
    ref,
    buttonComponent: ButtonComponent = Button,
    ...rest
  } = props;

  const { id: formId = props.form, form, formActionModel } = useFormContext();
  const ButtonViewComponent = useMemo(() => ButtonComponent, [formId]);

  return (
    <ButtonViewComponent
      color="secondary"
      variant="soft"
      {...rest}
      ref={ref}
      isDisabled={formActionModel.state.state === "isExecuting"}
      type="reset"
      onPress={() => form.reset()}
      form={formId}
    >
      {children}
    </ButtonViewComponent>
  );
});

export default ResetButton;
