import React from "react";
import * as Aria from "react-aria-components";
import type { TextFieldBaseProps } from "@/components/TextFieldBase";
import { TextFieldBase } from "@/components/TextFieldBase";
import styles from "./TextField.module.scss";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface TextFieldProps
  extends Omit<TextFieldBaseProps, "input" | "isReadOnly">,
    Pick<Aria.InputProps, "placeholder">,
    FlowComponentProps {}

export const TextField = flowComponent("TextField", (props) => {
  const { children, placeholder, ref, ...rest } = props;

  const input = (
    <Aria.Input
      placeholder={placeholder}
      className={styles.textField}
      ref={ref}
    />
  );

  return (
    <ClearPropsContext>
      <TextFieldBase {...rest} input={input}>
        {children}
      </TextFieldBase>
    </ClearPropsContext>
  );
});

export default TextField;
