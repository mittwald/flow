import { type FC, type PropsWithChildren, type ReactNode } from "react";
import { useState } from "react";
import * as Aria from "react-aria-components";
import styles from "../FormField/FormField.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import { FieldDescription } from "@/components/FieldDescription";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";

export interface TextFieldBaseProps
  extends PropsWithChildren<Omit<Aria.TextFieldProps, "children">>,
    Pick<FlowComponentProps<HTMLInputElement>, "ref"> {
  /** The input element */
  input: ReactNode;
  /** Whether a character count should be displayed inside the field description. */
  showCharacterCount?: boolean;
  /** Whether the password is visible or not if the type is "password" */
  isPasswordRevealed?: boolean;
}

export const TextFieldBase: FC<TextFieldBaseProps> = (props) => {
  const {
    children,
    className,
    input,
    showCharacterCount,
    ref,
    isPasswordRevealed,
    ...rest
  } = props;
  const [charactersCount, setCharactersCount] = useState(
    props.value?.length ?? 0,
  );

  const rootClassName = clsx(styles.formField, className);

  const translation = useLocalizedStringFormatter(locales);

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
      optional: !props.isRequired,
    },
    FieldDescription: {
      className: styles.fieldDescription,
    },
    FieldError: {
      className: styles.customFieldError,
    },
  };

  const handleOnChange = (v: string) => {
    if (showCharacterCount) {
      setCharactersCount(v.length);
    }
    if (props.onChange) {
      props.onChange(v);
    }
  };

  const charactersCountDescription = translation.format(
    "textFieldBase.characters",
    {
      count: charactersCount,
      maxCount: props.maxLength ?? 0,
    },
  );

  /** Prevent weird reset behavior when value is 'undefined' */
  const propsWithOptionalStringValue =
    "value" in props
      ? {
          value: props.value ?? "",
        }
      : {};

  return (
    <ClearPropsContext>
      <Aria.TextField
        ref={ref}
        {...rest}
        type={isPasswordRevealed ? "text" : "password"}
        className={rootClassName}
        onChange={handleOnChange}
        {...propsWithOptionalStringValue}
      >
        {input}
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
        {showCharacterCount && (
          <FieldDescription className={styles.fieldDescription}>
            {charactersCountDescription}
          </FieldDescription>
        )}
        <FieldError className={styles.fieldError} />
      </Aria.TextField>
    </ClearPropsContext>
  );
};

export default TextFieldBase;
