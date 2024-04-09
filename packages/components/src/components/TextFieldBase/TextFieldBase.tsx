import type { FC, PropsWithChildren, ReactNode } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "../FormField/FormField.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";

export interface TextFieldBaseProps
  extends PropsWithChildren<Omit<Aria.TextFieldProps, "children">> {
  input: ReactNode;
}

export const TextFieldBase: FC<TextFieldBaseProps> = (props) => {
  const { children, className, input, ...rest } = props;

  const rootClassName = clsx(styles.formField, className);

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
    <ClearPropsContext>
      <Aria.TextField {...rest} className={rootClassName}>
        {input}
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
        <FieldError className={styles.fieldError} />
      </Aria.TextField>
    </ClearPropsContext>
  );
};

export default TextFieldBase;
