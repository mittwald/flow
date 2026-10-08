import { type PropsWithChildren, useId } from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import styles from "./NumberField.module.scss";
import clsx from "clsx";
import { PropsContextProvider } from "@/lib/propsContext";
import { Button } from "@/components/Button";
import {
  IconChevronDown,
  IconChevronUp,
  IconMinus,
  IconPlus,
} from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import { NumberFieldUnit } from "./components/NumberFieldUnit";

export interface NumberFieldProps
  extends
    PropsWithChildren<Omit<Aria.NumberFieldProps, "children">>,
    FlowComponentProps<HTMLInputElement> {
  /**
   * A unit displayed after the number, for units `Intl.NumberFormat` does not
   * support (e.g. "MiB"). For supported units, use `formatOptions` instead.
   */
  unit?: string;
}

/** @flr-generate all */
export const NumberField = flowComponent("NumberField", (props) => {
  // `NaN` is what react-aria's number field state uses for "no number"
  const {
    children,
    className,
    isWheelDisabled = true,
    ref,
    unit,
    "aria-labelledby": ariaLabelledBy,
    ...rest
  } = useControlledHostValueProps(props, NaN);

  const unitId = useId();

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    wrapperProps,
    controlProps,
    fieldPropsContext,
  } = useFieldComponent(props, "NumberField");

  const rootClassName = clsx(formFieldStyles.formField, className);

  return (
    <Aria.NumberField
      {...rest}
      isWheelDisabled={isWheelDisabled}
      aria-labelledby={
        unit
          ? [ariaLabelledBy, unitId].filter(Boolean).join(" ")
          : ariaLabelledBy
      }
      aria-describedby={controlProps["aria-describedby"]}
      className={clsx(rootClassName, wrapperProps.className)}
    >
      <PropsContextProvider props={fieldPropsContext}>
        <FieldErrorCaptureContext>{children}</FieldErrorCaptureContext>
        <FieldErrorView />
      </PropsContextProvider>
      <Aria.Group className={styles.group}>
        <Button
          ariaSlot="decrement"
          className={styles.decrementButton}
          size="s"
          variant="plain"
          color="secondary"
        >
          <IconChevronDown />
          <IconMinus className={styles.coarsePointerIcon} />
        </Button>
        <div className={styles.inputContainer}>
          <Aria.Input className={styles.input} ref={ref} />
          {unit && <NumberFieldUnit id={unitId} unit={unit} />}
        </div>
        <Button
          ariaSlot="increment"
          className={styles.incrementButton}
          size="s"
          variant="plain"
          color="secondary"
        >
          <IconChevronUp />
          <IconPlus className={styles.coarsePointerIcon} />
        </Button>
      </Aria.Group>
    </Aria.NumberField>
  );
});

export default NumberField;
