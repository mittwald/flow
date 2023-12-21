import React, { FC, PropsWithChildren, ReactNode } from "react";
import * as Aria from "react-aria-components";
import styles from "./TextField.module.css";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";

export interface TextFieldProps
  extends PropsWithChildren<Omit<Aria.TextFieldProps, "children">> {
  errorMessage?: ReactNode;
}

export const TextField: FC<TextFieldProps> = (props) => {
  const { children, className, errorMessage, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  const propsContext: PropsContext = {
    label: {
      className: styles.label,
      optional: !props.isRequired,
    },
    fieldDescription: {
      className: styles.fieldDescription,
    },
  };

  return (
    <Aria.TextField {...rest} className={rootClassName}>
      <Aria.Input />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <FieldError className={styles.fieldError}>{errorMessage}</FieldError>
    </Aria.TextField>
  );
};

export default TextField;
