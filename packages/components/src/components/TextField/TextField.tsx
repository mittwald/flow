import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import * as Aria from "react-aria-components";
import { type PropsWithChildren, useState } from "react";
import { useControlledHostValueProps } from "@/lib/remote/useControlledHostValueProps";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import styles from "./TextField.module.scss";
import { FieldDescription } from "@/components/FieldDescription";
import { useLocalizedStringFormatter } from "react-aria";
import locales from "./locales/*.locale.json";
import { Button } from "@/components/Button";
import { IconHide, IconShow } from "@/components/Icon/components/icons";
import clsx from "clsx";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export interface TextFieldProps
  extends
    PropsWithChildren<Omit<Aria.TextFieldProps, "children">>,
    Pick<Aria.InputProps, "placeholder">,
    FlowComponentProps<HTMLInputElement> {
  /** Whether a character count should be displayed inside the field description. */
  showCharacterCount?: boolean;
}

/** @flr-generate all */
export const TextField = flowComponent("TextField", (props) => {
  const {
    className,
    showCharacterCount,
    form,
    placeholder,
    ref,
    type: typeFromProps,
    children,
    ...rest
  } = useControlledHostValueProps(props);

  const [charactersCount, setCharactersCount] = useState(
    props.defaultValue?.length ?? props.value?.length ?? 0,
  );

  const [type, setType] = useState(typeFromProps);

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    fieldProps,
  } = useFieldComponent(props);

  const rootClassName = clsx(fieldProps.className, className);

  const propsContext: PropsContext = {
    Button: {
      className: styles.button,
      variant: "plain",
      color: "secondary",
      tunnelId: "button",
    },
    ...fieldPropsContext,
  };

  const handleChange = (v: string) => {
    if (showCharacterCount) {
      setCharactersCount(v.length);
    }
    if (props.onChange) {
      props.onChange(v);
    }
  };

  const translation = useLocalizedStringFormatter(locales);

  const charactersCountDescription = translation.format(
    "textField.characters",
    {
      count: charactersCount,
      maxCount: props.maxLength ?? 0,
    },
  );

  return (
    <Aria.TextField
      {...rest}
      {...fieldProps}
      className={rootClassName}
      onChange={handleChange}
      type={type}
    >
      <PropsContextProvider props={propsContext}>
        <TunnelProvider>
          <FieldErrorCaptureContext>{children}</FieldErrorCaptureContext>
          <div className={styles.inputContainer}>
            <Aria.Input
              form={form}
              placeholder={placeholder}
              className={styles.input}
              ref={ref}
            />
            <TunnelExit id="button" />
            {typeFromProps === "password" && (
              <Button
                color="secondary"
                variant="plain"
                className={styles.button}
                onPress={() =>
                  setType(type === "password" ? "text" : "password")
                }
                aria-label={translation.format(
                  `textField.password.${type === "password" ? "show" : "hide"}`,
                )}
              >
                {type === "password" ? <IconShow /> : <IconHide />}
              </Button>
            )}
          </div>
        </TunnelProvider>
        {showCharacterCount && (
          <FieldDescription>{charactersCountDescription}</FieldDescription>
        )}
        <FieldErrorView />
      </PropsContextProvider>
    </Aria.TextField>
  );
});

export default TextField;
