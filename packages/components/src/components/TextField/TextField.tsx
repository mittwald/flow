import * as Aria from "react-aria-components";
import {
  TextFieldBase,
  type TextFieldBaseProps,
} from "@/components/TextFieldBase";
import styles from "./TextField.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { ReactAriaControlledValueFix } from "@/lib/react/ReactAriaControlledValueFix";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { PropsContextProvider } from "@/lib/propsContext";

export interface TextFieldProps
  extends Omit<TextFieldBaseProps, "FieldErrorView" | "input" | "className">,
    Pick<Aria.InputProps, "placeholder" | "form">,
    PropsWithClassName,
    FlowComponentProps<HTMLInputElement> {}

/** @flr-generate all */
export const TextField = flowComponent("TextField", (props) => {
  const { children, placeholder, ref, form, ...rest } = props;

  const input = (
    <ReactAriaControlledValueFix inputContext={Aria.InputContext} props={props}>
      <Aria.Input
        form={form}
        placeholder={placeholder}
        className={styles.textField}
        ref={ref}
      />
    </ReactAriaControlledValueFix>
  );

  const { FieldErrorView, propsContext, mergedRootClassName } =
    useFieldComponent(props);

  return (
    <TextFieldBase
      {...rest}
      FieldErrorView={FieldErrorView}
      className={mergedRootClassName}
      input={input}
    >
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </TextFieldBase>
  );
});

export default TextField;
