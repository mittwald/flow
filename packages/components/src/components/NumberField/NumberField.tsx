import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "../FormField/FormField.module.scss";
import styles from "./NumberField.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus";

export interface NumberFieldProps
  extends PropsWithChildren<Omit<Aria.NumberFieldProps, "children">> {}

export const NumberField: FC<NumberFieldProps> = (props) => {
  const { children, className, ...rest } = props;

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
    <Aria.NumberField {...rest} className={rootClassName}>
      <Aria.Group className={styles.group}>
        <Button
          slot="decrement"
          className={styles.decrementButton}
          size="s"
          variant="secondary"
          style="plain"
        >
          <Icon faIcon={faChevronDown} />
          <Icon faIcon={faMinus} />
        </Button>
        <Aria.Input className={styles.input} />
        <Button
          slot="increment"
          className={styles.incrementButton}
          size="s"
          variant="secondary"
          style="plain"
        >
          <Icon faIcon={faChevronUp} />
          <Icon faIcon={faPlus} />
        </Button>
      </Aria.Group>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <FieldError className={styles.fieldError} />
    </Aria.NumberField>
  );
};

export default NumberField;
