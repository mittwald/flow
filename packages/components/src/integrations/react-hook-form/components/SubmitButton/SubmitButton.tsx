import { Button, type ButtonProps } from "@/components/Button";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useFormContext } from "@/integrations/react-hook-form";
import { Action } from "@/components/Action";
import { useObjectRef } from "@react-aria/utils";
import { useMergeRefs } from "use-callback-ref";
import { type FC, useMemo } from "react";

export type SubmitButtonProps = Omit<
  ButtonProps,
  "isFailed" | "isSucceeded" | "isPending" | "isReadOnly" | "type"
> & {
  buttonComponent?: FC<Omit<ButtonProps, "ref">>;
};

export const SubmitButton = flowComponent("SubmitButton", (props) => {
  const {
    children,
    ref,
    buttonComponent: ButtonComponent = Button,
    ...rest
  } = props;

  const {
    id: formId = props.form,
    formActionModel,
    submitButtonRef: submitButtonRefFromFormContext,
  } = useFormContext();
  const ButtonViewComponent = useMemo(() => ButtonComponent, [formId]);

  const submitButtonRefFromProps = useObjectRef(ref);
  const submitButtonRef = useMergeRefs([
    submitButtonRefFromProps,
    submitButtonRefFromFormContext,
  ]);

  return (
    <Action actionModel={formActionModel}>
      <ButtonViewComponent
        {...rest}
        ref={submitButtonRef}
        type="submit"
        form={formId}
      >
        {children}
      </ButtonViewComponent>
    </Action>
  );
});

export default SubmitButton;
