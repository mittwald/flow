import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./TextArea.module.css";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";

export interface TextAreaProps
  extends PropsWithChildren<Omit<Aria.TextFieldProps, "children">>,
    Pick<Aria.TextAreaProps, "placeholder" | ""> {}

export const TextArea: FC<TextAreaProps> = (props) => {
  const { children, className, placeholder, ...rest } = props;

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
      <Aria.TextArea height={300} placeholder={placeholder} />
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
      <FieldError className={styles.fieldError} />
    </Aria.TextField>
  );
};

export default TextArea;
