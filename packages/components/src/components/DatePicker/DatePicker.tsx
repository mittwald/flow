import { type PropsWithChildren, type ReactNode } from "react";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import { DateInput } from "./components/DateInput";
import { FieldError } from "@/components/FieldError";
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

export interface DatePickerProps<T extends Aria.DateValue = Aria.DateValue>
  extends PropsWithChildren<Omit<Aria.DatePickerProps<T>, "children">>,
    FlowComponentProps {
  /** The error message that is displayed below the input. */
  errorMessage?: ReactNode;
}

/** @flr-generate all */
export const DatePicker = flowComponent("DatePicker", (props) => {
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

  const localRef = useObjectRef(ref);
  useMakeFocusable(localRef);

  const popoverController = useOverlayController("Popover");

  return (
    <Aria.DatePicker
      ref={localRef}
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
