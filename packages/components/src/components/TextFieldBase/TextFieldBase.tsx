import { type FC, type PropsWithChildren, type ReactNode } from "react";
import { useState } from "react";
import * as Aria from "react-aria-components";
import { FieldDescription } from "@/components/FieldDescription";
import locales from "./locales/*.locale.json";
import { useLocalizedStringFormatter } from "react-aria";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import type { UseFieldComponent } from "@/lib/hooks/useFieldComponent";
import styles from "../FormField/FormField.module.scss";

export interface TextFieldBaseProps
  extends PropsWithChildren<Omit<Aria.TextFieldProps, "children">>,
    Pick<FlowComponentProps<HTMLInputElement>, "ref">,
    Pick<UseFieldComponent, "FieldErrorView" | "FieldErrorCaptureContext"> {
  /** The input element */
  input: ReactNode;
  /** Whether a character count should be displayed inside the field description. */
  showCharacterCount?: boolean;
}

export const TextFieldBase: FC<TextFieldBaseProps> = (props) => {
  const {
    children,
    className,
    input,
    showCharacterCount,
    FieldErrorView,
    FieldErrorCaptureContext,
    ...rest
  } = props;

  const [charactersCount, setCharactersCount] = useState(
    props.defaultValue?.length ?? props.value?.length ?? 0,
  );

  const translation = useLocalizedStringFormatter(locales);

  const handleChange = (v: string) => {
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
    <Aria.TextField {...rest} className={className} onChange={handleChange}>
      <FieldErrorCaptureContext>
        {children}
        {input}
        {showCharacterCount && (
          <FieldDescription className={styles.fieldDescription}>
            {charactersCountDescription}
          </FieldDescription>
        )}
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </Aria.TextField>
  );
};

export default TextFieldBase;
