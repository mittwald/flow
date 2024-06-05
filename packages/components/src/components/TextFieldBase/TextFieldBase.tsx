import { PropsWithChildren, ReactNode, useState } from "react";
import React, { forwardRef } from "react";
import * as Aria from "react-aria-components";
import styles from "../FormField/FormField.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import { FieldError } from "@/components/FieldError";
import { FieldDescription } from "@/components/FieldDescription";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";

export interface TextFieldBaseProps
  extends PropsWithChildren<Omit<Aria.TextFieldProps, "children">> {
  input: ReactNode;
  showCharacterCount?: boolean;
}

export const TextFieldBase = forwardRef<HTMLInputElement, TextFieldBaseProps>(
  (props, ignoredRef) => {
    const { children, className, input, showCharacterCount, ...rest } = props;
    const [value, setValue] = useState(props.value);

    const rootClassName = clsx(styles.formField, className);

    const stringFormatter = useLocalizedStringFormatter(locales);

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

    return (
      <ClearPropsContext>
        <Aria.TextField
          {...rest}
          className={rootClassName}
          onChange={(v) => setValue(v)}
        >
          {input}
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
          {showCharacterCount && (
            <FieldDescription
              className={styles.fieldDescription}
            >{`${value?.length ?? 0} ${props.maxLength ? "/ " + props.maxLength : ""} ${stringFormatter.format("textFieldBase.characters")}`}</FieldDescription>
          )}
          <FieldError className={styles.fieldError} />
        </Aria.TextField>
      </ClearPropsContext>
    );
  },
);

export default TextFieldBase;
