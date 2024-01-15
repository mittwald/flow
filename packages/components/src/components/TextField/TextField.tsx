import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./TextField.module.css";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";

export interface TextFieldProps
  extends PropsWithChildren<Omit<Aria.TextFieldProps, "children">>,
    Pick<Aria.InputProps, "placeholder"> {}

export const TextField: FC<TextFieldProps> = (props) => {
  const { children, className, placeholder, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  const propsContext: PropsContext = {
    label: {
      className: styles.label,
      optional: !props.isRequired,
    },
    fieldDescription: {
      className: styles.fieldDescription,
    },
    fieldError: {
      className: styles.customFieldError,
    },
  };

  return (
    <Aria.TextField {...rest} className={rootClassName}>
      <Aria.Input placeholder={placeholder} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <FieldError className={styles.fieldError} />
    </Aria.TextField>
  );
};

export default TextField;
