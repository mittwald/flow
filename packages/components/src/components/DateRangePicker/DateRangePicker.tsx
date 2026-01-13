import type { PropsWithChildren } from "react";
import clsx from "clsx";
import { PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { Popover } from "@/components/Popover/Popover";
import { RangeCalendar } from "../Calendar/RangeCalendar";
import { DateRangeInput } from "./components/DateRangeInput";
import { useOverlayController } from "@/lib/controller";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface DateRangePickerProps<T extends Aria.DateValue = Aria.DateValue>
  extends PropsWithChildren<
      Omit<Aria.DateRangePickerProps<T>, "children" | "ref">
    >,
    FlowComponentProps<HTMLSpanElement> {}

/** @flr-generate all */
export const DateRangePicker = flowComponent("DateRangePicker", (props) => {
  const { children, className, onChange, ref, ...rest } = props;

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props);

  const rootClassName = clsx(fieldProps.className, className);

  const popoverController = useOverlayController("Popover");

  return (
    <Aria.DateRangePicker
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
          <RangeCalendar />
        </Popover>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </Aria.DateRangePicker>
  );
});

export default DateRangePicker;
