import React, {
  type PropsWithChildren,
  type ReactNode,
  useContext,
  useMemo,
} from "react";
import styles from "./FieldError.module.scss";
import * as Aria from "react-aria-components";
import { FieldErrorContext, TextContext } from "react-aria-components";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { AlertText } from "@/components/AlertText";
import { Alert } from "@/components/Alert";
import { Heading } from "@/components/Heading";

export interface FieldErrorProps
  extends
    PropsWithChildren<Omit<Aria.FieldErrorProps, "children">>,
    FlowComponentProps {
  /** @internal */
  renderAlert?: boolean;
}

/** @flr-generate all */
export const FieldError = flowComponent("FieldError", (props) => {
  const { children, className, ref, renderAlert, ...rest } = props;

  const rootClassName = clsx(styles.fieldError, className);
  const fieldErrorFromAriaContext = useContext(FieldErrorContext);
  const isInvalidFromChildren = React.Children.count(children) >= 1;

  const mergedErrorState = useMemo(() => {
    // Never mutate the context's errors: for a valid field react-aria hands
    // out one module-level array shared by every field of the page.
    const lastError: ReactNode = isInvalidFromChildren
      ? children
      : fieldErrorFromAriaContext?.validationErrors.at(-1);

    // Children are an error message of their own, so they make the error
    // visible even inside a field that is valid.
    const isInvalid = !!(
      isInvalidFromChildren || fieldErrorFromAriaContext?.isInvalid
    );
    const contextDetails = fieldErrorFromAriaContext?.validationDetails;

    return {
      ...fieldErrorFromAriaContext,
      isInvalid,
      validationDetails: {
        badInput: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        valueMissing: false,
        typeMismatch: false,
        ...contextDetails,
        valid: !isInvalid,
        customError: !!contextDetails?.customError || isInvalidFromChildren,
      },
      validationErrors: lastError ? [lastError] : [],
    };
  }, [fieldErrorFromAriaContext, children, isInvalidFromChildren]);

  if (!mergedErrorState.isInvalid) {
    return undefined;
  }

  return (
    <Aria.Provider values={[[TextContext, { slot: undefined }]]}>
      <FieldErrorContext value={mergedErrorState as never}>
        <Aria.FieldError ref={ref} {...rest} className={rootClassName}>
          {({ validationErrors }) => {
            return renderAlert ? (
              <Alert status="danger">
                <Heading>{validationErrors}</Heading>
              </Alert>
            ) : (
              <AlertText status="danger">{validationErrors}</AlertText>
            );
          }}
        </Aria.FieldError>
      </FieldErrorContext>
    </Aria.Provider>
  );
});

export default FieldError;
