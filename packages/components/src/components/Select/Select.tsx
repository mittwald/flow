import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { FieldError } from "@/components/FieldError";
import styles from "./Select.module.scss";
import clsx from "clsx";
import { IconChevronDown } from "@/components/Icon/components/icons";

export interface SelectProps
  extends PropsWithChildren<
    Omit<Aria.SelectProps<{ example: string }>, "children">
  > {
  label?: string;
}

export const Select: FC<SelectProps> = (props) => {
  const { children, className, label, ...rest } = props;

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
    <Aria.Select {...rest} className={rootClassName}>
      <Aria.Button className={styles.toggle}>
        <Aria.SelectValue />
        <IconChevronDown />
      </Aria.Button>

      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>

      <FieldError className={styles.fieldError} />
    </Aria.Select>
  );
};

export default Select;
