import React, {
  type PropsWithChildren,
  useContext,
  useLayoutEffect,
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
import { FieldErrorRenderedContext } from "@/lib/hooks/fieldErrorRenderedContext";
import { useObjectRef } from "react-aria";

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
  const fieldValidation = useContext(FieldErrorContext);
  const reportRendered = useContext(FieldErrorRenderedContext);
  const hasChildren = React.Children.count(children) >= 1;

  // Inside a field the field decides whether there is an error – children only
  // provide its message. Without a field, children are the error.
  const isInvalid = fieldValidation ? fieldValidation.isInvalid : hasChildren;

  // Never mutate the context's errors: for a valid field react-aria hands out
  // one module-level array shared by every field of the page.
  const message = hasChildren
    ? children
    : fieldValidation?.validationErrors.at(-1);

  const errorState = {
    isInvalid,
    validationDetails: fieldValidation?.validationDetails ?? {
      badInput: false,
      customError: isInvalid,
      patternMismatch: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      typeMismatch: false,
      valid: !isInvalid,
      valueMissing: false,
    },
    validationErrors: message ? [message] : [],
  };

  // Report what is actually in the document: inside a collection (`Select`,
  // `ComboBox`) react-aria renders the children a second time into a hidden
  // collection document, where no field context exists and no id resolves.
  const localRef = useObjectRef(ref);
  useLayoutEffect(() => {
    const element = localRef.current;
    if (!reportRendered || !isInvalid || !element?.isConnected || !element.id) {
      return;
    }
    reportRendered(element.id);
    return () => reportRendered(undefined);
  }, [reportRendered, isInvalid, rest.id, localRef]);

  if (!isInvalid) {
    return undefined;
  }

  return (
    <Aria.Provider values={[[TextContext, { slot: undefined }]]}>
      <FieldErrorContext value={errorState as never}>
        <Aria.FieldError ref={localRef} {...rest} className={rootClassName}>
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
