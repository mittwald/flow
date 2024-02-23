import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import formFieldStyles from "../FormField/FormField.module.scss";
import styles from "./NumberField.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import {
  IconChevronDown,
  IconChevronUp,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";

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
          size="small"
          style="plain"
          variant="secondary"
        >
          <Icon tablerIcon={<IconChevronDown />} />
          <Icon className={styles.touchIcon} tablerIcon={<IconMinus />} />
        </Button>
        <Aria.Input className={styles.input} />
        <Button
          slot="increment"
          className={styles.incrementButton}
          size="small"
          style="plain"
          variant="secondary"
        >
          <Icon tablerIcon={<IconChevronUp />} />
          <Icon className={styles.touchIcon} tablerIcon={<IconPlus />} />
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
