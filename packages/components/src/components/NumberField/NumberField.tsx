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

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const NumberField = flowComponent<"NumberField", HTMLInputElement>(
  "NumberField",
  (props) => {
    const { children, className, ref, ...rest } = props;

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
        <Aria.NumberField {...rest} className={rootClassName}>
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
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
          <FieldError className={formFieldStyles.fieldError} />
        </Aria.NumberField>
      </ClearPropsContext>
    );
  },
);

export default NumberField;
