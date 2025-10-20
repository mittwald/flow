import React, { type PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { PropsContextProvider } from "@/lib/propsContext";
import styles from "./TimeField.module.scss";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useObjectRef } from "@react-aria/utils";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
export interface TimeFieldProps<T extends Aria.TimeValue = Aria.TimeValue>
  extends PropsWithChildren<Omit<Aria.TimeFieldProps<T>, "children">>,
    FlowComponentProps<HTMLInputElement> {}

/** @flr-generate all */
export const TimeField = flowComponent("TimeField", (props) => {
  const { children, ref, ...rest } = props;

  const { FieldErrorView, fieldPropsContext, fieldProps } =
    useFieldComponent(props);

  const localRef = useObjectRef(ref);
  useMakeFocusable(localRef);

  return (
    <Aria.TimeField ref={localRef} hourCycle={24} {...rest} {...fieldProps}>
      <Aria.DateInput className={styles.dateInput}>
        {(segment) => <Aria.DateSegment segment={segment} />}
      </Aria.DateInput>
      <PropsContextProvider props={fieldPropsContext}>
        {children}
      </PropsContextProvider>
      <FieldErrorView />
    </Aria.TimeField>
  );
});

export default TimeField;
