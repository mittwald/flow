import React, { FC } from "react";
import * as Aria from "react-aria-components";
import { TextFieldBase, TextFieldBaseProps } from "@/components/TextFieldBase";

export interface TextFieldProps
  extends Omit<TextFieldBaseProps, "input">,
    Pick<Aria.InputProps, "placeholder"> {}

export const TextField: FC<TextFieldProps> = (props) => {
  const { children, placeholder, ...rest } = props;

  return (
    <TextFieldBase {...rest} input={<Aria.Input placeholder={placeholder} />}>
      {children}
    </TextFieldBase>
  );
};

export default TextField;
