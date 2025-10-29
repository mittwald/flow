import React, {
  type FC,
  type PropsWithChildren,
  memo,
  useContext,
  useId,
  type ReactNode,
  useMemo,
} from "react";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { FieldErrorContext } from "react-aria-components";
import { TunnelExit } from "@mittwald/react-tunnel";
import ClearPropsContext from "@/lib/propsContext/components/ClearPropsContext";

const FieldErrorResetContext: FC<PropsWithChildren> = memo((props) => (
  <FieldErrorContext value={null}>{props.children}</FieldErrorContext>
));

export const FieldErrorsStateContext = React.createContext<{
  currentTunnelId?: string;
}>({});

export const useFieldError = (tunnelIdFromProps?: string) => {
  const id = useId();
  const { currentTunnelId } = useContext(FieldErrorsStateContext);

  const tunnelId = tunnelIdFromProps ?? currentTunnelId ?? `${id}.fieldError`;

  const fieldErrorCapturePropsContext: PropsContext = {
    FieldError: {
      ___inherit: true,
      ___persistent: true,
      tunnelId,
      className: formFieldStyles.fieldError,
    },
  };

  const FieldErrorCaptureContext: FC<PropsWithChildren> = useMemo(
    () => (props) => {
      return (
        <PropsContextProvider
          levelMode={"keep"}
          props={fieldErrorCapturePropsContext}
        >
          <FieldErrorsStateContext value={{ currentTunnelId: tunnelId }}>
            {props.children}
          </FieldErrorsStateContext>
        </PropsContextProvider>
      );
    },
    [id],
  );

  const FieldErrorView = () =>
    useMemo(() => {
      if (currentTunnelId) {
        return null;
      }

      return (
        <TunnelExit id={tunnelId}>
          {(children: ReactNode) => {
            const childrenArray = React.Children.toArray(children);
            return <ClearPropsContext>{childrenArray[0]}</ClearPropsContext>;
          }}
        </TunnelExit>
      );
    }, [currentTunnelId, tunnelId]);

  return {
    FieldErrorCaptureContext,
    FieldErrorView,
    FieldErrorResetContext,
  } as const;
};
