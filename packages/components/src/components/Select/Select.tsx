import type { FC, PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import formFieldStyles from "@/components/FormField/FormField.module.scss";
import { FieldError } from "@/components/FieldError";
import styles from "./Select.module.scss";
import clsx from "clsx";
import { IconChevronDown } from "@/components/Icon/components/icons";

export interface SelectProps
  extends PropsWithChildren<
    Omit<Aria.SelectProps<{ example: string }>, "children" | "className">
  > {
  className?: string;
}

export const Select: FC<SelectProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(
    styles.select,
    formFieldStyles.formField,
    className,
  );

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

      <FieldError className={formFieldStyles.fieldError} />
    </Aria.Select>
  );
};

export default Select;
