import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { FieldError } from "@/components/FieldError";
import clsx from "clsx";
import styles from "./TimeField.module.scss";

export interface TimeFieldProps<T extends Aria.TimeValue>
  extends PropsWithChildren<Omit<Aria.TimeFieldProps<T>, "children">> {
  errorMessage?: ReactNode;
}

export const TimeField = flowComponent("TimeField", (props) => {
  const { children, errorMessage, className, ...rest } = props;

  const rootClassName = clsx(formFieldStyles.formField, className);

  const propsContext: PropsContext = {
    Label: {
      className: formFieldStyles.label,
      optional: !props.isRequired,
      isDisabled: rest.isDisabled,
    },
    FieldDescription: {
      className: formFieldStyles.fieldDescription,
    },
    FieldError: {
      className: formFieldStyles.customFieldError,
    },
  };

  return (
    <Aria.TimeField hourCycle={24} className={rootClassName} {...rest}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <FieldError className={formFieldStyles.fieldError}>
        {errorMessage}
      </FieldError>
      <Aria.DateInput className={styles.dateInput}>
        {(segment) => <Aria.DateSegment segment={segment} />}
      </Aria.DateInput>
    </Aria.TimeField>
  );
});

export default TimeField;
