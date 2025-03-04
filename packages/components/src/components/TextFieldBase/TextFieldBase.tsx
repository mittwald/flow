import { FieldDescription } from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { FC, PropsWithChildren, ReactNode, Ref } from "react";
import { useState } from "react";
import { useLocalizedStringFormatter } from "react-aria";
import * as Aria from "react-aria-components";
import styles from "../FormField/FormField.module.scss";
import locales from "./locales/*.locale.json";

export interface TextFieldBaseProps
  extends PropsWithChildren<Omit<Aria.TextFieldProps, "children">> {
  ref?: Ref<HTMLInputElement>;
  /** The input element */
  input: ReactNode;
  /** Whether a character count should be displayed inside the field description. */
  showCharacterCount?: boolean;
}

export const TextFieldBase: FC<TextFieldBaseProps> = (props) => {
  const { children, className, input, showCharacterCount, ...rest } = props;
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

  return (
    <ClearPropsContextView>
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
    </ClearPropsContextView>
  );
};

export default TextFieldBase;
