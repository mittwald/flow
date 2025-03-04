import type { TextFieldBaseProps } from "@/components/TextFieldBase";
import { TextFieldBase } from "@/components/TextFieldBase";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import * as Aria from "react-aria-components";
import styles from "./TextField.module.scss";

export interface TextFieldProps
  extends Omit<TextFieldBaseProps, "input" | "className">,
    Pick<Aria.InputProps, "placeholder" | "form">,
    PropsWithClassName,
    FlowComponentProps {}

/** @flr-generate all */
export const TextField = flowComponent("TextField", (props) => {
  const { children, placeholder, ref, form, ...rest } = props;

  const input = (
    <Aria.Input
      form={form}
      placeholder={placeholder}
      className={styles.textField}
      ref={ref}
    />
  );

  return (
    <ClearPropsContextView>
      <TextFieldBase {...rest} input={input}>
        {children}
      </TextFieldBase>
    </ClearPropsContextView>
  );
});

export default TextField;
