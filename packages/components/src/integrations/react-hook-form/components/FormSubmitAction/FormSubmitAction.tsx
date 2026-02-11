import Action, { ActionBatch } from "@/components/Action";
import { useFormContext } from "@/integrations/react-hook-form/components/FormContextProvider";
import { useFormSubmitAction } from "@/integrations/react-hook-form/components/FormContextProvider/useFormSubmitAction";
import type { FC, PropsWithChildren } from "react";

const InnerFormSubmitAction: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const { form, setReadOnly } = useFormContext();

  const formSubmitAction = useFormSubmitAction({
    form,
    setReadOnly,
  });

  return <Action actionModel={formSubmitAction}>{children}</Action>;
};

export const FormSubmitAction: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  const { onAfterSuccessFeedback } = useFormContext();

  return (
    <ActionBatch>
      <Action onAction={onAfterSuccessFeedback}>
        <ActionBatch>
          <InnerFormSubmitAction>{children}</InnerFormSubmitAction>
        </ActionBatch>
      </Action>
    </ActionBatch>
  );
};

export default FormSubmitAction;
