import type { ForwardedRef } from "react";
import React, { useRef } from "react";
import * as Aria from "react-aria-components";
import type { TextFieldBaseProps } from "@/components/TextFieldBase";
import { TextFieldBase } from "@/components/TextFieldBase";
import styles from "./TextArea.module.scss";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { mergeRefs } from "@react-aria/utils";

export interface TextAreaProps
  extends Omit<TextFieldBaseProps, "input">,
    Pick<Aria.TextAreaProps, "placeholder" | "rows">,
    FlowComponentProps {
  maxRows?: number;
}

export const TextArea = flowComponent("TextArea", (props) => {
  const {
    children,
    placeholder,
    rows = 5,
    maxRows = rows,
    refProp: ref,
    ...rest
  } = props;

  const resizeRef = useRef<HTMLTextAreaElement>(null);

  const getHeight = (rows: number) => {
    return `calc(var(--line-height--m) * ${rows} + (var(--form-control--padding-y) * 2))`;
  };

  const input = (
    <Aria.TextArea
      rows={rows}
      placeholder={placeholder}
      className={styles.textArea}
      ref={mergeRefs(
        ref as ForwardedRef<HTMLTextAreaElement | null>,
        resizeRef,
      )}
      onChange={() => {
        if (resizeRef.current && rows !== maxRows) {
          resizeRef.current.style.height = "0px";
          const scrollHeight = resizeRef.current?.scrollHeight;
          resizeRef.current.style.height = scrollHeight + "px";
        }
      }}
      style={{
        minHeight: getHeight(rows),
        maxHeight: getHeight(maxRows),
      }}
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
