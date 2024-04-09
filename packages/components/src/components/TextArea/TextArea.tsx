import type { FC } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import type { TextFieldBaseProps } from "@/components/TextFieldBase";
import { TextFieldBase } from "@/components/TextFieldBase";
import styles from "./TextArea.module.scss";
import { ClearPropsContext } from "@/lib/propsContext";

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
    <ClearPropsContext>
      <TextFieldBase {...rest} input={input}>
        {children}
      </TextFieldBase>
    </ClearPropsContext>
  );
};

export default TextArea;
