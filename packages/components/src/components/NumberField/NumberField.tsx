import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "../FormField/FormField.module.scss";
import styles from "./NumberField.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
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

export interface NumberFieldProps
  extends PropsWithChildren<Omit<Aria.NumberFieldProps, "children">>,
    FlowComponentProps<HTMLInputElement> {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const NumberField = flowComponent("NumberField", (props) => {
  const {
    children,
    className,
    ref,
    defaultValue,
    isWheelDisabled = true,
    ...rest
  } = props;

  const rootClassName = clsx(formFieldStyles.formField, className);

  const propsContext: PropsContext = {
    Label: {
      className: formFieldStyles.label,
      optional: !props.isRequired,
    },
    FieldDescription: {
      className: formFieldStyles.fieldDescription,
    },
    FieldError: {
      className: formFieldStyles.customFieldError,
    },
  };

  return (
    <ClearPropsContext>
      <Aria.NumberField
        {...rest}
        isWheelDisabled={isWheelDisabled}
        defaultValue={defaultValue}
        className={rootClassName}
      >
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
            inputContext={Aria.InputContext}
            props={props}
          >
            <Aria.Input className={styles.input} ref={ref} />
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
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
        <FieldError className={formFieldStyles.fieldError} />
      </Aria.NumberField>
    </ClearPropsContext>
  );
});

export default NumberField;
