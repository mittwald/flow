import { FieldError } from "@/components/FieldError";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";
import * as Aria from "react-aria-components";
import styles from "./TimeField.module.scss";

export interface TimeFieldProps<T extends Aria.TimeValue = Aria.TimeValue>
  extends PropsWithChildren<Omit<Aria.TimeFieldProps<T>, "children">> {
  /** An error message to be displayed below the field */
  errorMessage?: ReactNode;
}

/** @flr-generate all */
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
