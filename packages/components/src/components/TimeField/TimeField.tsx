import { type PropsWithChildren, type ReactNode } from "react";
import * as Aria from "react-aria-components";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { FieldError } from "@/components/FieldError";
import clsx from "clsx";
import styles from "./TimeField.module.scss";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useObjectRef } from "@react-aria/utils";

export interface TimeFieldProps<T extends Aria.TimeValue = Aria.TimeValue>
  extends PropsWithChildren<Omit<Aria.TimeFieldProps<T>, "children">>,
    FlowComponentProps<HTMLInputElement> {
  /** An error message to be displayed below the field */
  errorMessage?: ReactNode;
}

/** @flr-generate all */
export const TimeField = flowComponent("TimeField", (props) => {
  const { children, errorMessage, className, ref, ...rest } = props;

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

  const localRef = useObjectRef(ref);
  useMakeFocusable(localRef);

  return (
    <Aria.TimeField
      ref={localRef}
      hourCycle={24}
      className={rootClassName}
      {...rest}
    >
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
