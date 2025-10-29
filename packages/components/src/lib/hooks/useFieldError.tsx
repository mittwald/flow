import React, {
  type FC,
  type PropsWithChildren,
  memo,
  useContext,
  useId,
  type ReactNode,
} from "react";
import { type PropsContext } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { FieldErrorContext } from "react-aria-components";
import { FieldError } from "@/components/FieldError";
import { TunnelExit } from "@mittwald/react-tunnel";
import ClearPropsContext from "@/lib/propsContext/components/ClearPropsContext";

const FieldErrorResetContext: FC<PropsWithChildren> = memo((props) => (
  <FieldErrorContext value={null}>{props.children}</FieldErrorContext>
));

export const useFieldError = () => {
  const id = useId();
  const tunnelId = `${id}.fieldError`;
  const currentOuterErrorContext = useContext(FieldErrorContext);

  const fieldErrorViewPropsContext: PropsContext = {
    FieldError: {
      tunnelId,
      className: formFieldStyles.fieldError,
    },
  };

  const FieldErrorView = () => (
    <TunnelExit id={tunnelId}>
      {(children: ReactNode) => {
        const currentInnerErrorContext = useContext(FieldErrorContext);

        const errorContext =
          currentOuterErrorContext ?? currentInnerErrorContext;

        if (React.Children.count(children) >= 1) {
          return <ClearPropsContext>{children}</ClearPropsContext>;
        }

        if (
          errorContext?.isInvalid &&
          errorContext.validationErrors.length === 0
        ) {
          return null;
        }

        return (
          <ClearPropsContext>
            <FieldErrorContext value={errorContext}>
              <FieldError className={formFieldStyles.fieldError} />
            </FieldErrorContext>
          </ClearPropsContext>
        );
      }}
    </TunnelExit>
  );

  return {
    fieldErrorViewPropsContext,
    FieldErrorView,
    FieldErrorResetContext,
  } as const;
};
