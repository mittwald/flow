import React, { FC, PropsWithChildren, ReactNode } from "react";
import styles from "../FormField/FormField.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { Popover } from "@/components/Popover";
import { RangeCalendar, DateRangeInput } from "./index";
import { FieldError } from "@/components/FieldError";
import { DateValue } from "@internationalized/date";

export interface DateRangePickerProps<T extends Aria.DateValue>
  extends PropsWithChildren<Omit<Aria.DateRangePickerProps<T>, "children">> {
  errorMessage?: ReactNode;
}

export const DateRangePicker: FC<DateRangePickerProps<DateValue>> = (props) => {
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
    <Aria.DateRangePicker {...rest} className={rootClassName}>
      <DateRangeInput isDisabled={props.isDisabled} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <FieldError className={styles.fieldError}>{errorMessage}</FieldError>
      <Popover placement="bottom end">
        <Aria.Dialog>
          <RangeCalendar />
        </Aria.Dialog>
      </Popover>
    </Aria.DateRangePicker>
  );
};

export default DateRangePicker;
