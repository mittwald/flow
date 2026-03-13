import React, {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useId,
} from "react";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { TunnelExit } from "@mittwald/react-tunnel";

const FieldErrorContext = createContext<null | string>(null);

export const useFieldError = () => {
  const id = useId() + ".fieldError";
  const tunnelIdFromContext = useContext(FieldErrorContext);
  const currentTunnelId = tunnelIdFromContext ?? id;

  const fieldErrorCapturePropsContext: PropsContext = {
    FieldError: {
      tunnelId: currentTunnelId,
      className: formFieldStyles.fieldError,
    },
  };

  const FieldErrorCaptureContext: FC<PropsWithChildren> = (props) => {
    return (
      <FieldErrorContext value={currentTunnelId}>
        <PropsContextProvider props={fieldErrorCapturePropsContext}>
          {props.children}
        </PropsContextProvider>
      </FieldErrorContext>
    );
  };

  const FieldErrorView = () => {
    if (tunnelIdFromContext) {
      return;
    }

    return (
      <TunnelExit id={id}>
        {(children) => {
          const childrenArray = React.Children.toArray(children);
          return childrenArray[0];
        }}
      </TunnelExit>
    );
  };

  return {
    FieldErrorCaptureContext,
    FieldErrorView,
  } as const;
};
