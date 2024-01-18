import React, { FC } from "react";
import * as Aria from "react-aria-components";
import { TextFieldBase, TextFieldBaseProps } from "@/components/TextFieldBase";

export interface TextAreaProps
  extends TextFieldBaseProps,
    Pick<Aria.TextAreaProps, "placeholder" | "rows"> {}

export const TextArea: FC<TextAreaProps> = (props) => {
  const { children, placeholder, rows = 5, ...rest } = props;

  return (
    <TextFieldBase
      {...rest}
      input={<Aria.TextArea rows={rows} placeholder={placeholder} />}
    >
      {children}
    </TextFieldBase>
  );
};

export default TextArea;
