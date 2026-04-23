import type { PropsWithChildren } from "react";
import clsx from "clsx";
import { PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { Popover } from "@/components/Popover";
import { type DateRangePresets, RangeCalendar } from "@/components/Calendar";
import { DateRangeInput } from "./components/DateRangeInput";
import { useOverlayController } from "@/lib/controller";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import type { RangeValue } from "react-aria";
import type { DateValue } from "@internationalized/date";
import styles from "./DateRangePicker.module.scss";

export interface DateRangePickerProps<T extends Aria.DateValue = Aria.DateValue>
  extends
    PropsWithChildren<Omit<Aria.DateRangePickerProps<T>, "children" | "ref">>,
    FlowComponentProps<HTMLSpanElement> {
  withDatePickerPresets?: boolean | DateRangePresets;
}

/** @flr-generate all */
export const DateRangePicker = flowComponent("DateRangePicker", (props) => {
  const {
    children,
    className,
    onChange,
    ref,
    withDatePickerPresets = false,
    ...rest
  } = useControlledHostValueProps(props);

  const popoverController = useOverlayController("Popover");
  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props, "DateRangePicker");

  const rootClassName = clsx(fieldProps.className, className);

  const onDatePickerChange = (value: RangeValue<DateValue> | null) => {
    if (onChange) {
      onChange(value);
    }
    popoverController.close();
  };

  return (
    <Aria.DateRangePicker
      {...rest}
      className={rootClassName}
      onOpenChange={(v) => popoverController.setOpen(v)}
      isOpen={popoverController.isOpen}
      onChange={onDatePickerChange}
    >
      <FieldErrorCaptureContext>
        <DateRangeInput isDisabled={props.isDisabled} ref={ref} />
        <PropsContextProvider props={fieldPropsContext}>
          {children}
        </PropsContextProvider>
        <Popover
          placement="bottom end"
          isDialogContent
          controller={popoverController}
        >
          <RangeCalendar
            withDatePickerPresets={withDatePickerPresets}
            className={styles.calendar}
          />
        </Popover>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </Aria.DateRangePicker>
  );
});

export default DateRangePicker;
