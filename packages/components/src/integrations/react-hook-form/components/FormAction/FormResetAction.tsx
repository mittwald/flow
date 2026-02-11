import Action, { type ActionProps } from "@/components/Action";
import { useFormContext } from "@/integrations/react-hook-form/components/FormContextProvider";
import { PropsContextProvider, type PropsContext } from "@/lib/propsContext";
import type { FC, PropsWithChildren } from "react";

type SupportedActionProps = Pick<ActionProps, "showFeedback">;

export const FormResetAction: FC<PropsWithChildren<SupportedActionProps>> = (
  props,
) => {
  const { children, ...actionProps } = props;

  const { form, isReadOnly, id } = useFormContext();

  const propsContext: PropsContext = {
    Button: {
      isReadOnly,
      form: id,
      color: "secondary",
      variant: "soft",
      type: "button",
    },
  };

  return (
    <Action onAction={() => form.reset()} {...actionProps}>
      <PropsContextProvider
        props={propsContext}
        dependencies={[isReadOnly, id]}
      >
        {children}
      </PropsContextProvider>
    </Action>
  );
};
