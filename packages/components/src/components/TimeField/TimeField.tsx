import { type PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { PropsContextProvider } from "@/lib/propsContext";
import styles from "./TimeField.module.scss";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import DateInput from "@/components/DateInput";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";

export interface TimeFieldProps<T extends Aria.TimeValue = Aria.TimeValue>
  extends
    PropsWithChildren<Omit<Aria.TimeFieldProps<T>, "children">>,
    FlowComponentProps<HTMLSpanElement> {}

/** @flr-generate all */
export const TimeField = flowComponent("TimeField", (props) => {
  // `null` is what react-aria's time field state uses for "no time"
  const { children, ref, ...rest } = useControlledHostValueProps(props, null);

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    wrapperProps,
    controlProps,
  } = useFieldComponent(props, "TimeField");

  return (
    <Aria.TimeField
      hourCycle={24}
      {...rest}
      {...wrapperProps}
      {...controlProps}
    >
      <FieldErrorCaptureContext>
        <DateInput className={styles.dateInput} ref={ref} />
        <PropsContextProvider props={fieldPropsContext}>
          {children}
        </PropsContextProvider>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </Aria.TimeField>
  );
});

export default TimeField;
