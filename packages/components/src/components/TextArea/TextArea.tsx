import React from "react";
import * as Aria from "react-aria-components";
import type { TextFieldBaseProps } from "@/components/TextFieldBase";
import { TextFieldBase } from "@/components/TextFieldBase";
import styles from "./TextArea.module.scss";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface TextAreaProps
  extends Omit<TextFieldBaseProps, "input">,
    Pick<Aria.TextAreaProps, "placeholder" | "rows">,
    FlowComponentProps {}

export const TextArea = flowComponent("TextArea", (props) => {
  const { children, placeholder, rows = 5, ref, ...rest } = props;

  const input = (
    <Aria.TextArea
      rows={rows}
      placeholder={placeholder}
      className={styles.textArea}
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

export default TextArea;
