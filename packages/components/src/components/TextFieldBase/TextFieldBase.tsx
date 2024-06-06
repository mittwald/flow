import type { PropsWithChildren, ReactNode } from "react";
import React, { forwardRef, useState } from "react";
import * as Aria from "react-aria-components";
import styles from "../FormField/FormField.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import { FieldDescription } from "@/components/FieldDescription";
import locales from "./locales/*.locale.json";
import { useMessageFormatter } from "react-aria";

export interface TextFieldBaseProps
  extends PropsWithChildren<Omit<Aria.TextFieldProps, "children">> {
  input: ReactNode;
  showCharacterCount?: boolean;
}

export const TextFieldBase = forwardRef<HTMLInputElement, TextFieldBaseProps>(
  (props, ignoredRef) => {
    const { children, className, input, showCharacterCount, ...rest } = props;
    const [charactersCount, setCharactersCount] = useState(
      props.value?.length ?? 0,
    );

    const rootClassName = clsx(styles.formField, className);

    const translate = useMessageFormatter(locales);

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

    const charactersCountDescription = translate("textFieldBase.characters", {
      count: charactersCount,
      maxCount: props.maxLength,
    });

    return (
      <ClearPropsContext>
        <Aria.TextField
          {...rest}
          className={rootClassName}
          onChange={handleOnChange}
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
  },
);

export default TextFieldBase;
