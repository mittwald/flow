import Action, { ActionBatch, type ActionProps } from "@/components/Action";
import { useFormContext } from "@/integrations/react-hook-form/components/FormContextProvider";
import { useFormSubmitAction } from "@/integrations/react-hook-form/components/FormContextProvider/useFormSubmitAction";
import { PropsContextProvider, type PropsContext } from "@/lib/propsContext";
import type { FC, PropsWithChildren } from "react";

const InnerFormSubmitAction: FC<PropsWithChildren<SupportedActionProps>> = (
  props,
) => {
  const { children, ...actionProps } = props;
  const { form } = useFormContext();
  const formSubmitAction = useFormSubmitAction(form.formState, actionProps);
  return (
    <Action actionModel={formSubmitAction} {...actionProps}>
      {children}
    </Action>
  );
};

type SupportedActionProps = Pick<ActionProps, "showFeedback">;

export const FormSubmitAction: FC<PropsWithChildren<SupportedActionProps>> = (
  props,
) => {
  const { children, ...actionProps } = props;

  const { onAfterSuccessFeedback, isReadOnly, id } = useFormContext();

  const propsContext: PropsContext = {
    Button: {
      isReadOnly,
      type: "submit",
      form: id,
    },
  };

  const innerSubmitAction = (
    <InnerFormSubmitAction {...actionProps}>
      <PropsContextProvider
        props={propsContext}
        dependencies={[isReadOnly, id]}
      >
        {children}
      </PropsContextProvider>
    </InnerFormSubmitAction>
  );

  if (onAfterSuccessFeedback) {
    return (
      <Action onAction={onAfterSuccessFeedback}>
        <ActionBatch>{innerSubmitAction}</ActionBatch>
      </Action>
    );
  }

  return innerSubmitAction;
};

export default FormSubmitAction;
