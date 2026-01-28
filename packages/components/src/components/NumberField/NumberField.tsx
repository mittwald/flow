import { type PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "../FormField/FormField.module.scss";
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

export interface NumberFieldProps
  extends
    PropsWithChildren<Omit<Aria.NumberFieldProps, "children">>,
    FlowComponentProps<HTMLInputElement> {}

/** @flr-generate all */
export const NumberField = flowComponent("NumberField", (props) => {
  const {
    children,
    className,
    isWheelDisabled = true,
    ref,
    ...rest
  } = useControlledHostValueProps(props);

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props);

  const rootClassName = clsx(formFieldStyles.formField, className);

  return (
    <Aria.NumberField
      {...rest}
      isWheelDisabled={isWheelDisabled}
      className={clsx(rootClassName, fieldProps.className)}
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
        <Aria.Input className={styles.input} ref={ref} />
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
