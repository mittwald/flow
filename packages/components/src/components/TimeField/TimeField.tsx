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

export interface TimeFieldProps<T extends Aria.TimeValue = Aria.TimeValue>
  extends PropsWithChildren<Omit<Aria.TimeFieldProps<T>, "children">>,
    FlowComponentProps<HTMLSpanElement> {}

/** @flr-generate all */
export const TimeField = flowComponent("TimeField", (props) => {
  const { children, ref, ...rest } = props;

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    fieldProps,
  } = useFieldComponent(props);

  return (
    <Aria.TimeField hourCycle={24} {...rest} {...fieldProps}>
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
