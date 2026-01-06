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
import { InlineAlert } from "@/components/InlineAlert";

export interface FieldErrorProps
  extends PropsWithChildren<Omit<Aria.FieldErrorProps, "children">>,
    FlowComponentProps {}

/** @flr-generate all */
export const FieldError = flowComponent("FieldError", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.fieldError, className);
  const fieldErrorFromAriaContext = useContext(FieldErrorContext);
  const isInvalidFromChildren = React.Children.count(children) >= 1;

  const mergedErrorState = useMemo(() => {
    const errors: (string | ReactNode)[] =
      fieldErrorFromAriaContext?.validationErrors ?? [];

    if (isInvalidFromChildren) {
      errors.push(children);
    }

    const isInvalid = !!(
      isInvalidFromChildren || fieldErrorFromAriaContext?.isInvalid
    );
    const lastError =
      errors.length >= 1 ? errors[errors.length - 1] : undefined;

    return {
      isInvalid: isInvalid,
      validationDetails: {
        valid: !isInvalid,
        badInput: false,
        customError: isInvalid,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        valueMissing: false,
        typeMismatch: false,
        ...fieldErrorFromAriaContext?.validationDetails,
      },
      ...fieldErrorFromAriaContext,
      validationErrors: lastError ? [lastError] : [],
    };
  }, [fieldErrorFromAriaContext, children]);

  if (!mergedErrorState.isInvalid) {
    return undefined;
  }

  return (
    <Aria.Provider values={[[TextContext, { slot: undefined }]]}>
      <FieldErrorContext value={mergedErrorState as never}>
        <Aria.FieldError ref={ref} {...rest} className={rootClassName}>
          {({ validationErrors }) => {
            return (
              <InlineAlert status="danger">{validationErrors}</InlineAlert>
            );
          }}
        </Aria.FieldError>
      </FieldErrorContext>
    </Aria.Provider>
  );
});

export default FieldError;
