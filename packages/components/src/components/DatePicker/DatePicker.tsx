import { type PropsWithChildren } from "react";
import clsx from "clsx";
import { PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { DateInput } from "./components/DateInput";
import { Popover } from "@/components/Popover/Popover";
import { useOverlayController } from "@/lib/controller";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { Calendar } from "@/components/Calendar";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import styles from "./DatePicker.module.scss";
import { getBodyInnerWidth } from "@/lib/dom/getBodyInnerWidth";

export interface DatePickerProps<T extends Aria.DateValue = Aria.DateValue>
  extends
    PropsWithChildren<Omit<Aria.DatePickerProps<T>, "children" | "ref">>,
    FlowComponentProps<HTMLSpanElement> {}

/** @flr-generate all */
export const DatePicker = flowComponent("DatePicker", (props) => {
  const { children, className, onChange, ref, ...rest } = props;

  const popoverController = useOverlayController("Popover");
  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props, "DatePicker");

  const rootClassName = clsx(fieldProps.className, className);

  const calendarClassName = clsx(
    styles.calendar,
    getBodyInnerWidth() < 300 && styles.small,
  );

  return (
    <Aria.DatePicker
      {...rest}
      {...fieldProps}
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
      <FieldErrorCaptureContext>
        <DateInput isDisabled={props.isDisabled} ref={ref} />
        <PropsContextProvider props={fieldPropsContext}>
          {children}
        </PropsContextProvider>
        <Popover
          placement="bottom end"
          isDialogContent
          controller={popoverController}
        >
          <Calendar className={calendarClassName} />
        </Popover>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </Aria.DatePicker>
  );
});

export default DatePicker;
