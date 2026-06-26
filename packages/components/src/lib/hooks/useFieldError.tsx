import React, { type FC, type PropsWithChildren, useMemo } from "react";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import ClearPropsContext from "@/lib/propsContext/components/ClearPropsContext";
import { useProps } from "@/lib/hooks/useProps";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import type { FlowComponentName } from "@/components/propTypes";

export interface UseFieldErrorOptions {
  fieldErrorId: string;
  tunnelId?: string;
  component: FlowComponentName;
}

export const useFieldError = (options: UseFieldErrorOptions) => {
  const fieldErrorProps = useProps("FieldError", {});
  const currentTunnelId = fieldErrorProps.tunnel?.id;
  const tunnelId =
    options.tunnelId ?? currentTunnelId ?? `${options.fieldErrorId}.fieldError`;

  const fieldErrorCapturePropsContext: PropsContext = {
    FieldError: {
      id: options.fieldErrorId,
      tunnel: { id: tunnelId, component: options.component },
      className: formFieldStyles.fieldError,
    },
  };

  const FieldErrorCaptureContext: FC<PropsWithChildren> = useMemo(
    () => (props) => {
      return (
        <PropsContextProvider
          props={fieldErrorCapturePropsContext}
          dependencies={[tunnelId]}
        >
          {props.children}
        </PropsContextProvider>
      );
    },
    [tunnelId],
  );

  const FieldErrorView = () => {
    if (currentTunnelId) {
      return null;
    }

    return (
      <UiComponentTunnelExit id={tunnelId} component={options.component}>
        {(children) => {
          const childrenArray = React.Children.toArray(children);
          return <ClearPropsContext>{childrenArray[0]}</ClearPropsContext>;
        }}
      </UiComponentTunnelExit>
    );
  };

  return {
    FieldErrorCaptureContext,
    FieldErrorView,
  } as const;
};
