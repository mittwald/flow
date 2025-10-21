import { type PropsWithChildren } from "react";
import clsx from "clsx";
import { PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { DateInput } from "./components/DateInput";
import styles from "../FormField/FormField.module.scss";
import { Popover } from "@/components/Popover/Popover";
import { useOverlayController } from "@/lib/controller";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { Calendar } from "@/components/Calendar";
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface DatePickerProps<T extends Aria.DateValue = Aria.DateValue>
  extends PropsWithChildren<Omit<Aria.DatePickerProps<T>, "children">>,
    FlowComponentProps {}

/** @flr-generate all */
export const DatePicker = flowComponent("DatePicker", (props) => {
  const { children, className, onChange, ref, ...rest } = props;

  const { FieldErrorView, fieldProps, fieldPropsContext } =
    useFieldComponent(props);

  const rootClassName = clsx(styles.formField, className);

  const localRef = useObjectRef(ref);
  useMakeFocusable(localRef);

  const popoverController = useOverlayController("Popover");

  return (
    <Aria.DatePicker
      ref={localRef}
      {...rest}
      {...fieldProps}
      className={clsx(fieldProps.className, rootClassName)}
      onOpenChange={(v) => popoverController.setOpen(v)}
      isOpen={popoverController.isOpen}
      onChange={(value) => {
        if (onChange) {
          onChange(value);
        }
        popoverController.close();
      }}
    >
      <DateInput isDisabled={props.isDisabled} />
      <PropsContextProvider props={fieldPropsContext}>
        {children}
      </PropsContextProvider>
      <Popover
        placement="bottom end"
        isDialogContent
        controller={popoverController}
      >
        <Calendar />
      </Popover>
      <FieldErrorView />
    </Aria.DatePicker>
  );
});

export default DatePicker;
