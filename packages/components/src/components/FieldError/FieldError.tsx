import { type PropsWithChildren, useContext, useMemo } from "react";
import React from "react";
import styles from "./FieldError.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { IconDanger } from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { FieldErrorContext } from "react-aria-components";
import { onlyText } from "react-children-utilities";

export interface FieldErrorProps
  extends PropsWithChildren<Omit<Aria.FieldErrorProps, "children">>,
    FlowComponentProps {}

/** @flr-generate all */
export const FieldError = flowComponent("FieldError", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.fieldError, className);
  const fieldErrorFromAriaContext = useContext(FieldErrorContext);

  const mergedErrorState = useMemo(() => {
    if (React.Children.count(children) >= 1) {
      const textChildren = onlyText(children);
      if (!textChildren) {
        return fieldErrorFromAriaContext;
      }

      return {
        isInvalid: true,
        validationErrors: [textChildren],
        validationDetails: {
          valid: false,
          badInput: false,
          customError: true,
          patternMismatch: false,
          rangeOverflow: false,
          rangeUnderflow: false,
          stepMismatch: false,
          tooLong: false,
          tooShort: false,
          valueMissing: false,
          typeMismatch: false,
        },
      };
    }

    return fieldErrorFromAriaContext;
  }, [fieldErrorFromAriaContext, children]);

  return (
    <FieldErrorContext value={mergedErrorState}>
      <Aria.FieldError ref={ref} {...rest} className={rootClassName}>
        {({ validationErrors }) => {
          return (
            <>
              <IconDanger size="s" />
              <span>{validationErrors.join(" ")}</span>
            </>
          );
        }}
      </Aria.FieldError>
    </FieldErrorContext>
  );
});

export default FieldError;
