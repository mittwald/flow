import React, { FC, PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { Popover } from "@/components/Popover";
import { Calendar } from "./components/Calendar";
import { DateInput } from "./components/DateInput";
import { FieldError } from "@/components/FieldError";
import styles from "../FormField/FormField.module.scss";
import { DateValue } from "@internationalized/date";

export interface DatePickerProps<T extends Aria.DateValue>
  extends PropsWithChildren<Omit<Aria.DatePickerProps<T>, "children">> {
  errorMessage?: ReactNode;
}

export const DatePicker: FC<DatePickerProps<DateValue>> = (props) => {
  const { children, className, errorMessage, ...rest } = props;

  const rootClassName = clsx(styles.formField, className);

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
      optional: !props.isRequired,
    },
    FieldDescription: {
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
