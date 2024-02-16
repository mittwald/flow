import React, { FC } from "react";
import * as Aria from "react-aria-components";
import { TextFieldBase, TextFieldBaseProps } from "@/components/TextFieldBase";
import styles from "./TextArea.module.scss";

export interface TextAreaProps
  extends Omit<TextFieldBaseProps, "input">,
    Pick<Aria.TextAreaProps, "placeholder" | "rows"> {}

export const TextArea: FC<TextAreaProps> = (props) => {
  const { children, placeholder, rows = 5, ...rest } = props;

  const input = (
    <Aria.TextArea
      rows={rows}
      placeholder={placeholder}
      className={styles.textArea}
    />
  );

  return (
    <TextFieldBase {...rest} input={input}>
      {children}
    </TextFieldBase>
  );
};

export default TextArea;
