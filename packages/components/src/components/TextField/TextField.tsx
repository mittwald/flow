import React, { FC } from "react";
import * as Aria from "react-aria-components";
import styles from "./TextField.module.css";
import clsx from "clsx";
import { TextFieldBase, TextFieldBaseProps } from "@/components/TextFieldBase";

export interface TextFieldProps
  extends Omit<TextFieldBaseProps, "input">,
    Pick<Aria.InputProps, "placeholder"> {}

export const TextField: FC<TextFieldProps> = (props) => {
  const { children, className, placeholder, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <TextFieldBase
      {...rest}
      className={rootClassName}
      input={<Aria.Input placeholder={placeholder} />}
    >
      {children}
    </TextFieldBase>
  );
};

export default TextField;
