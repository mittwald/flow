import React from "react";
import * as Aria from "react-aria-components";
import type { TextFieldBaseProps } from "@/components/TextFieldBase";
import { TextFieldBase } from "@/components/TextFieldBase";
import styles from "./TextField.module.scss";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";

export interface TextFieldProps
  extends Omit<TextFieldBaseProps, "input" | "className">,
    Pick<Aria.InputProps, "placeholder" | "form">,
    PropsWithClassName,
    FlowComponentProps<HTMLInputElement> {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const TextField = flowComponent("TextField", (props) => {
  const { children, placeholder, ref, form, ...rest } = props;

  const input = (
    <Aria.Input
      form={form}
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
