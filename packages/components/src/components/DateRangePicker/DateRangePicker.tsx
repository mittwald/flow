import type { FC, PropsWithChildren, ReactNode } from "react";
import React from "react";
import styles from "../FormField/FormField.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { Popover } from "@/components/Popover";
import { RangeCalendar } from "./components/RangeCalendar";
import { DateRangeInput } from "./components/DateRangeInput";
import { FieldError } from "@/components/FieldError";
import { useOverlayController } from "@/lib/controller";

export interface DateRangePickerProps<T extends Aria.DateValue>
  extends PropsWithChildren<Omit<Aria.DateRangePickerProps<T>, "children">> {
  errorMessage?: ReactNode;
}

export const DateRangePicker: FC<DateRangePickerProps<Aria.DateValue>> = (
  props,
) => {
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

  const popoverController = useOverlayController("Popover");

  return (
    <Aria.DateRangePicker
      {...rest}
      className={rootClassName}
      onOpenChange={(v) => popoverController.setOpen(v)}
      isOpen={popoverController.isOpen}
      onChange={popoverController.close}
    >
      <DateRangeInput isDisabled={props.isDisabled} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <FieldError className={styles.fieldError}>{errorMessage}</FieldError>
      <Popover
        placement="bottom end"
        isDialogContent
        controller={popoverController}
      >
        <RangeCalendar />
      </Popover>
    </Aria.DateRangePicker>
  );
};

export default DateRangePicker;
