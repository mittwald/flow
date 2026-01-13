import React, { type FC, type PropsWithChildren, useId, useMemo } from "react";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { TunnelExit } from "@mittwald/react-tunnel";
import ClearPropsContext from "@/lib/propsContext/components/ClearPropsContext";
import { useProps } from "@/lib/hooks/useProps";

export const useFieldError = (tunnelIdFromProps?: string) => {
  const id = useId();
  const currentTunnelId = useProps("FieldError", {}).tunnelId;
  const tunnelId = tunnelIdFromProps ?? currentTunnelId ?? `${id}.fieldError`;

  const fieldErrorCapturePropsContext: PropsContext = {
    FieldError: {
      tunnelId,
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
      <TunnelExit id={tunnelId}>
        {(children) => {
          const childrenArray = React.Children.toArray(children);
          return <ClearPropsContext>{childrenArray[0]}</ClearPropsContext>;
        }}
      </TunnelExit>
    );
  };

  return {
    FieldErrorCaptureContext,
    FieldErrorView,
  } as const;
};
