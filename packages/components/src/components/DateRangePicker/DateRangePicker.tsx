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
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useObjectRef } from "@react-aria/utils";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface DateRangePickerProps<T extends Aria.DateValue = Aria.DateValue>
  extends PropsWithChildren<Omit<Aria.DateRangePickerProps<T>, "children">>,
    FlowComponentProps {}

/** @flr-generate all */
export const DateRangePicker = flowComponent("DateRangePicker", (props) => {
  const { children, className, onChange, ref, ...rest } = props;

  const { FieldErrorView, fieldProps, fieldPropsContext } =
    useFieldComponent(props);

  const rootClassName = clsx(fieldProps.className, className);

  const popoverController = useOverlayController("Popover");

  const localDateRangePickerRef = useObjectRef(ref);
  useMakeFocusable(localDateRangePickerRef);

  return (
    <Aria.DateRangePicker
      ref={localDateRangePickerRef}
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
      <FieldErrorView />
    </Aria.DateRangePicker>
  );
});

export default DateRangePicker;
