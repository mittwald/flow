import * as Aria from "react-aria-components";
import type { TextFieldBaseProps } from "@/components/TextFieldBase";
import { TextFieldBase } from "@/components/TextFieldBase";
import styles from "./TextArea.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useObjectRef } from "@react-aria/utils";
import { ReactAriaControlledValueFix } from "@/lib/react/ReactAriaControlledValueFix";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { PropsContextProvider } from "@/lib/propsContext";

export interface TextAreaProps
  extends Omit<TextFieldBaseProps, "FieldErrorView" | "input" | "ref">,
    Pick<Aria.TextAreaProps, "placeholder" | "rows">,
    FlowComponentProps<HTMLTextAreaElement> {
  /**
   * Whether the text area should grow if its content gets longer than its
   * initial height.
   */
  autoResizeMaxRows?: number;
}

/** @flr-generate all */
export const TextArea = flowComponent("TextArea", (props) => {
  const {
    children,
    placeholder,
    rows = 5,
    autoResizeMaxRows = rows,
    ref,
    ...rest
  } = props;

  const localRef = useObjectRef(ref);

  const getHeight = (rows: number) => {
    return `calc(var(--line-height--m) * ${rows} + (var(--form-control--padding-y) * 2))`;
  };

  const updateHeight = () => {
    if (localRef.current && rows !== autoResizeMaxRows) {
      // https://stackoverflow.com/a/60795884
      localRef.current.style.height = "0px";
      const scrollHeight = localRef.current.scrollHeight;
      localRef.current.style.height = scrollHeight + "px";
    }
  };

  const input = (
    <ReactAriaControlledValueFix
      inputContext={Aria.TextAreaContext}
      props={props}
    >
      <Aria.TextArea
        rows={rows}
        placeholder={placeholder}
        className={styles.textArea}
        ref={localRef}
        onChange={updateHeight}
        style={{
          minHeight: getHeight(rows),
          maxHeight: getHeight(autoResizeMaxRows),
        }}
      />
    </ReactAriaControlledValueFix>
  );

  const { FieldErrorView, fieldPropsContext, fieldProps } =
    useFieldComponent(props);

  return (
    <TextFieldBase
      {...rest}
      {...fieldProps}
      FieldErrorView={FieldErrorView}
      input={input}
    >
      <PropsContextProvider props={fieldPropsContext}>
        {children}
      </PropsContextProvider>
    </TextFieldBase>
  );
});

export default TextArea;
