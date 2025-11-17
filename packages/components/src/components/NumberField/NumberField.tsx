import React, { type PropsWithChildren, type RefObject } from "react";
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
import { ReactAriaControlledValueFix } from "@/lib/react/ReactAriaControlledValueFix";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";
import { useObjectRef } from "@react-aria/utils";

export interface NumberFieldProps
  extends PropsWithChildren<Omit<Aria.NumberFieldProps, "children">>,
    FlowComponentProps {
  inputRef?: RefObject<HTMLInputElement | null>;
}

/** @flr-generate all */
export const NumberField = flowComponent("NumberField", (props) => {
  const {
    children,
    className,
    ref,
    inputRef,
    defaultValue,
    isWheelDisabled = true,
    ...rest
  } = props;

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldProps,
    fieldPropsContext,
  } = useFieldComponent(props);

  const rootClassName = clsx(formFieldStyles.formField, className);

  const localNumberFieldRef = useObjectRef(ref);
  const localNumberFieldInputRef = useObjectRef(inputRef);

  useMakeFocusable(localNumberFieldRef, () => {
    localNumberFieldInputRef?.current?.focus();
  });

  return (
    <Aria.NumberField
      {...rest}
      ref={localNumberFieldRef}
      isWheelDisabled={isWheelDisabled}
      defaultValue={defaultValue}
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
        <ReactAriaControlledValueFix
          inputContext={Aria.NumberFieldContext}
          props={props}
        >
          <Aria.Input className={styles.input} ref={localNumberFieldInputRef} />
        </ReactAriaControlledValueFix>
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
