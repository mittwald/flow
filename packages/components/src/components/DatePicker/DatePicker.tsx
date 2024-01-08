import React, { FC, PropsWithChildren, ReactNode } from "react";
import styles from "./DatePicker.module.css";
import clsx from "clsx";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { Popover } from "@/components/Popover";
import { Calendar } from "./components/Calendar";
import { DateInput } from "./components/DateInput";
import { FieldError } from "@/components/FieldError";

export interface DatePickerProps<T extends Aria.DateValue>
  extends PropsWithChildren<Omit<Aria.DatePickerProps<T>, "children">> {
  errorMessage?: ReactNode;
}

export const DatePicker: FC<DatePickerProps<any>> = (props) => {
  const { children, className, errorMessage, ...rest } = useProps(
    "datePicker",
    props,
  );

  const rootClassName = clsx(className, styles.root);

  const propsContext: PropsContext = {
    label: {
      className: styles.label,
      optional: !props.isRequired,
    },
    fieldDescription: {
      className: styles.fieldDescription,
    },
  };

  return (
    <Aria.DatePicker {...rest} className={rootClassName}>
      <DateInput isDisabled={props.isDisabled} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <FieldError className={styles.fieldError}>{errorMessage}</FieldError>
      <Popover placement="bottom end">
        <Aria.Dialog>
          <Calendar />
        </Aria.Dialog>
      </Popover>
    </Aria.DatePicker>
  );
};

export default DatePicker;
