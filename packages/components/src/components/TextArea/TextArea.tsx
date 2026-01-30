import * as Aria from "react-aria-components";
import styles from "./TextArea.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useObjectRef } from "@react-aria/utils";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import { type PropsWithChildren, useEffect, useState } from "react";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";
import { FieldDescription } from "@/components/FieldDescription";

export interface TextAreaProps
  extends
    PropsWithChildren<Omit<Aria.TextFieldProps, "children">>,
    Pick<Aria.TextAreaProps, "placeholder" | "rows" | "aria-hidden">,
    FlowComponentProps<HTMLTextAreaElement> {
  /** Whether a character count should be displayed inside the field description. */
  showCharacterCount?: boolean;
  /**
   * Whether the text area should grow if its content gets longer than its
   * initial height.
   */
  autoResizeMaxRows?: number;
  /** Allows the user to manually resize the textArea horizontally. */
  allowResize?: boolean | "horizontal" | "vertical";

  /** @deprecated Use `allowResize` instead. */
  allowHorizontalResize?: boolean;
  /** @deprecated Use `allowResize` instead. */
  allowVerticalResize?: boolean;
}

/** @flr-generate all */
export const TextArea = flowComponent("TextArea", (props) => {
  const {
    children,
    placeholder,
    rows = 5,
    autoResizeMaxRows = rows,
    ref,
    allowVerticalResize,
    allowHorizontalResize,
    showCharacterCount,
    className,
    ...rest
  } = useControlledHostValueProps(props);

  const [charactersCount, setCharactersCount] = useState(
    props.defaultValue?.length ?? props.value?.length ?? 0,
  );

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    fieldProps,
  } = useFieldComponent(props);

  let { allowResize } = props;
  if (allowVerticalResize) {
    allowResize = "vertical";
  } else if (allowHorizontalResize) {
    allowResize = "horizontal";
  }

  const rootClassName = clsx(
    typeof allowResize === "boolean" && allowResize ? styles.resize : null,
    allowResize === "horizontal"
      ? styles.horizontalResize
      : allowResize === "vertical"
        ? styles.verticalResize
        : null,
    fieldProps.className,
    className,
  );

  const handleChange = (v: string) => {
    if (showCharacterCount) {
      setCharactersCount(v.length);
    }
    if (props.onChange) {
      props.onChange(v);
    }
  };

  const translation = useLocalizedStringFormatter(locales);

  const charactersCountDescription = translation.format("textArea.characters", {
    count: charactersCount,
    maxCount: props.maxLength ?? 0,
  });

  const localRef = useObjectRef(ref);

  const getHeight = (rows: number) => {
    return `calc(var(--line-height--m) * ${rows} + (var(--form-control--padding-y) * 2))`;
  };

  const [resized, setResized] = useState(false);

  const autoResizable = rows !== autoResizeMaxRows;

  const verticallyResizable =
    allowResize && (!autoResizable || (autoResizable && resized));

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

  return (
    <Aria.TextField
      {...rest}
      {...fieldProps}
      className={rootClassName}
      onChange={handleChange}
    >
      <PropsContextProvider props={fieldPropsContext}>
        <FieldErrorCaptureContext>{children}</FieldErrorCaptureContext>
        <Aria.TextArea
          rows={rows}
          aria-hidden={props["aria-hidden"]}
          placeholder={placeholder}
          className={styles.input}
          ref={localRef}
          onChange={updateHeight}
          style={{
            minHeight: getHeight(rows),
            maxHeight: verticallyResizable
              ? undefined
              : getHeight(autoResizeMaxRows),
          }}
        />
        {showCharacterCount && (
          <FieldDescription>{charactersCountDescription}</FieldDescription>
        )}
        <FieldErrorView />
      </PropsContextProvider>
    </Aria.TextField>
  );
});

export default TextArea;
