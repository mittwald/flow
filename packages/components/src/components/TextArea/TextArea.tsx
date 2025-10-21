import * as Aria from "react-aria-components";
import type { TextFieldBaseProps } from "@/components/TextFieldBase";
import { TextFieldBase } from "@/components/TextFieldBase";
import styles from "./TextArea.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useObjectRef } from "@react-aria/utils";
import { ReactAriaControlledValueFix } from "@/lib/react/ReactAriaControlledValueFix";
import clsx from "clsx";

export interface TextAreaProps
  extends Omit<TextFieldBaseProps, "input" | "ref">,
    Pick<Aria.TextAreaProps, "placeholder" | "rows">,
    FlowComponentProps<HTMLTextAreaElement> {
  /**
   * Whether the text area should grow if its content gets longer than its
   * initial height.
   */
  autoResizeMaxRows?: number;
  /** Allows the user to manually resize the textArea horizontally. */
  allowHorizontalResize?: boolean;
  /** Allows the user to manually resize the textArea vertically. */
  allowVerticalResize?: boolean;
  /**
   * Allows the user to manually resize the textArea horizontally and
   * vertically.
   */
  allowResize?: boolean;
}

/** @flr-generate all */
export const TextArea = flowComponent("TextArea", (props) => {
  const {
    children,
    placeholder,
    rows = 5,
    autoResizeMaxRows = rows,
    ref,
    allowResize,
    allowVerticalResize,
    allowHorizontalResize,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.textArea,
    allowResize && styles.resize,
    allowVerticalResize && styles.verticalResize,
    allowHorizontalResize && styles.horizontalResize,
  );

  const localRef = useObjectRef(ref);

  const getHeight = (rows: number) => {
    return `calc(var(--line-height--m) * ${rows} + (var(--form-control--padding-y) * 2))`;
  };

  const verticallyResizable = allowResize || allowVerticalResize;

  const updateHeight = () => {
    if (
      localRef.current &&
      rows !== autoResizeMaxRows &&
      !verticallyResizable
    ) {
      // https://stackoverflow.com/a/60795884
      localRef.current.style.height = "0px";
      const scrollHeight = localRef.current.scrollHeight;
      // + 2 to add border height
      localRef.current.style.height = scrollHeight + 2 + "px";
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
        className={rootClassName}
        ref={localRef}
        onChange={updateHeight}
        style={{
          minHeight: getHeight(rows),
          maxHeight: verticallyResizable
            ? undefined
            : getHeight(autoResizeMaxRows),
        }}
      />
    </ReactAriaControlledValueFix>
  );

  return (
    <TextFieldBase {...rest} input={input}>
      {children}
    </TextFieldBase>
  );
});

export default TextArea;
