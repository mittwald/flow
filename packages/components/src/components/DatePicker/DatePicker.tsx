import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { Calendar } from "./components/Calendar";
import { DateInput } from "./components/DateInput";
import { FieldError } from "@/components/FieldError";
import styles from "../FormField/FormField.module.scss";
import { Popover } from "@/components/Popover";
import { useOverlayController } from "@/lib/controller";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface DatePickerProps<T extends Aria.DateValue>
  extends PropsWithChildren<Omit<Aria.DatePickerProps<T>, "children">> {
  errorMessage?: ReactNode;
}

export const DatePicker = flowComponent("DatePicker", (props) => {
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
    FieldError: {
      className: styles.customFieldError,
    },
  };

  const popoverController = useOverlayController("Popover");

  return (
    <Aria.DatePicker
      {...rest}
      className={rootClassName}
      onOpenChange={(v) => popoverController.setOpen(v)}
      isOpen={popoverController.isOpen}
      onChange={popoverController.close}
    >
      <DateInput isDisabled={props.isDisabled} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <FieldError className={styles.fieldError}>{errorMessage}</FieldError>
      <Popover
        placement="bottom end"
        isDialogContent
        controller={popoverController}
      >
        <Calendar />
      </Popover>
    </Aria.DatePicker>
  );
});

export default DatePicker;
