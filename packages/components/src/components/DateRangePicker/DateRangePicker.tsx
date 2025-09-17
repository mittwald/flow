import type { PropsWithChildren, ReactNode } from "react";
import styles from "../FormField/FormField.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { Popover } from "@/components/Popover/Popover";
import { RangeCalendar } from "../Calendar/RangeCalendar";
import { DateRangeInput } from "./components/DateRangeInput";
import { FieldError } from "@/components/FieldError";
import { useOverlayController } from "@/lib/controller";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface DateRangePickerProps<T extends Aria.DateValue = Aria.DateValue>
  extends PropsWithChildren<Omit<Aria.DateRangePickerProps<T>, "children">>,
    FlowComponentProps {
  /** The error message that is displayed below the input. */
  errorMessage?: ReactNode;
}

/** @flr-generate all */
export const DateRangePicker = flowComponent("DateRangePicker", (props) => {
  const { children, className, errorMessage, onChange, ref, ...rest } = props;

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
    <Aria.DateRangePicker
      ref={ref}
      {...rest}
      className={rootClassName}
      onOpenChange={(v) => popoverController.setOpen(v)}
      isOpen={popoverController.isOpen}
      onChange={(value) => {
        if (onChange) {
          onChange(value);
        }
        popoverController.close();
      }}
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
});

export default DateRangePicker;
