import React, { FC } from "react";
import * as Aria from "react-aria-components";
import styles from "./TextArea.module.css";
import clsx from "clsx";
import { TextFieldBase, TextFieldBaseProps } from "@/components/TextFieldBase";

export interface TextAreaProps
  extends TextFieldBaseProps,
    Pick<Aria.TextAreaProps, "placeholder" | "rows"> {}

export const TextArea: FC<TextAreaProps> = (props) => {
  const { children, className, placeholder, rows = 5, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return (
    <TextFieldBase
      {...rest}
      className={rootClassName}
      input={<Aria.TextArea rows={rows} placeholder={placeholder} />}
    >
      {children}
    </TextFieldBase>
  );
};

export default TextArea;
