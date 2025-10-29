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
import clsx from "clsx";
import { useEffect, useState } from "react";

export interface TextAreaProps
  extends Omit<TextFieldBaseProps, "FieldErrorView" | "input" | "ref">,
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

  const [resized, setResized] = useState(false);

  const autoResizable = rows !== autoResizeMaxRows;

  const verticallyResizable =
    (allowResize || allowVerticalResize) &&
    (!autoResizable || (autoResizable && resized));

  useEffect(() => {
    const textarea = localRef.current;
    if (!textarea) return;

    const startHeight = textarea.offsetHeight;
    let tracking = false;

    const handleMouseDown = () => {
      tracking = true;
    };

    const handleMouseMove = () => {
      if (!tracking || resized) return;

      const currentHeight = textarea.offsetHeight;

      if (currentHeight !== startHeight) {
        setResized(true);
        tracking = false;
      }
    };

    const handleMouseUp = () => {
      tracking = false;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resized]);

  const updateHeight = () => {
    if (localRef.current && autoResizable && !verticallyResizable) {
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

  const { FieldErrorView, fieldPropsContext, fieldProps } =
    useFieldComponent(props);

  return (
    <TextFieldBase
      {...rest}
      {...fieldProps}
      className={clsx(rest.className, fieldProps.className)}
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
