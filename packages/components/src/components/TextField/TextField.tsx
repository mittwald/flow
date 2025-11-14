import * as Aria from "react-aria-components";
import {
  TextFieldBase,
  type TextFieldBaseProps,
} from "@/components/TextFieldBase";
import styles from "./TextField.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { PropsContextProvider } from "@/lib/propsContext";

export interface TextFieldProps
  extends Omit<
      TextFieldBaseProps,
      "FieldErrorView" | "FieldErrorCaptureContext" | "input" | "className"
    >,
    Pick<Aria.InputProps, "placeholder" | "form">,
    PropsWithClassName,
    FlowComponentProps<HTMLInputElement> {}

/** @flr-generate all */
export const TextField = flowComponent("TextField", (props) => {
  const {
    children,
    placeholder,
    ref,
    form,
    inputContext = Aria.TextFieldContext,
    ...rest
  } = props;

  const input = (
    <Aria.Input
      form={form}
      placeholder={placeholder}
      className={styles.textField}
      ref={ref}
    />
  );

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    fieldProps,
  } = useFieldComponent(props);

  return (
    <TextFieldBase
      {...rest}
      {...fieldProps}
      FieldErrorView={FieldErrorView}
      FieldErrorCaptureContext={FieldErrorCaptureContext}
      input={input}
      inputContext={inputContext}
    >
      <PropsContextProvider props={fieldPropsContext}>
        {children}
      </PropsContextProvider>
    </TextFieldBase>
  );
});

export default TextField;
