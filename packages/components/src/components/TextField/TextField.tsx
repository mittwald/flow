import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import type { TextFieldBaseProps } from "@/components/TextFieldBase";
import { TextFieldBase } from "@/components/TextFieldBase";
import styles from "./TextField.module.scss";
import { ClearPropsContext } from "@/lib/propsContext";

export interface TextFieldProps
  extends Omit<TextFieldBaseProps, "input">,
    Pick<Aria.InputProps, "placeholder"> {}

export const TextField: FC<TextFieldProps> = (props) => {
  const { children, placeholder, ...rest } = props;

  const input = (
    <Aria.Input placeholder={placeholder} className={styles.textField} />
  );

  return (
    <ClearPropsContext>
      <TextFieldBase {...rest} input={input}>
        {children}
      </TextFieldBase>
    </ClearPropsContext>
  );
};

export default TextField;
