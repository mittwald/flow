import type { PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "../FormField/FormField.module.scss";
import styles from "./NumberField.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
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

export interface NumberFieldProps
  extends PropsWithChildren<Omit<Aria.NumberFieldProps, "children">>,
    FlowComponentProps {}

export const NumberField = flowComponent("NumberField", (props) => {
  const { children, className, ref, onChange, ...rest } = props;

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

  const handleOnChange = (value: number) => {
    /**
     * When entering numbers via keyboard, the NumberField onChange event is
     * triggered onBlur. When clicking on another form element directly after
     * changing an invalid NumberField from invalid to valid (via keyboard), the
     * users click may not hit the desired target, because the removed
     * validation message may cause a layout-shift. To circumvent this pitfall,
     * the onChange event is delayed for a little time.
     */
    setTimeout(() => {
      if (onChange) {
        onChange(value);
      }
    }, 150);
  };

  return (
    <ClearPropsContext>
      <Aria.NumberField
        {...rest}
        className={rootClassName}
        onChange={handleOnChange}
      >
        <Aria.Group className={styles.group}>
          <Button
            slot="decrement"
            className={styles.decrementButton}
            size="s"
            style="plain"
            variant="secondary"
          >
            <IconChevronDown />
            <IconMinus className={styles.coarsePointerIcon} />
          </Button>
          <Aria.Input className={styles.input} ref={ref} />
          <Button
            slot="increment"
            className={styles.incrementButton}
            size="s"
            style="plain"
            variant="secondary"
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
