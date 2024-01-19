import React, { FC, PropsWithChildren, ReactNode } from "react";
import * as Aria from "react-aria-components";
import styles from "./TextFieldBase.module.css";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";

export interface TextFieldBaseProps
  extends PropsWithChildren<Omit<Aria.TextFieldProps, "children">> {
  input: ReactNode;
}

export const TextFieldBase: FC<TextFieldBaseProps> = (props) => {
  const { children, className, input, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
      optional: !props.isRequired,
    },
    FieldDescription: {
      className: styles.fieldDescription,
    },
    FieldError: {
      className: styles.customFieldError,
    },
  };

  return (
    <Aria.TextField {...rest} className={rootClassName}>
      {input}
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <FieldError className={styles.fieldError} />
    </Aria.TextField>
  );
};

export default TextFieldBase;
