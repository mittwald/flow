import * as Aria from "react-aria-components";
import {
  TextFieldBase,
  type TextFieldBaseProps,
} from "@/components/TextFieldBase";
import styles from "./TextField.module.scss";
import passwordFieldStyles from "../PasswordCreationField/PasswordCreationField.module.scss";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { ReactAriaControlledValueFix } from "@/lib/react/ReactAriaControlledValueFix";
import TogglePasswordVisibilityButton from "@/components/PasswordCreationField/components/TogglePasswordVisibilityButton/TogglePasswordVisibilityButton";
import React, { useState } from "react";

export interface TextFieldProps
  extends Omit<TextFieldBaseProps, "input" | "className">,
    Pick<Aria.InputProps, "placeholder" | "form">,
    PropsWithClassName,
    FlowComponentProps<HTMLInputElement> {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const TextField = flowComponent("TextField", (props) => {
  const {
    children,
    placeholder,
    ref,
    form,
    type: typeFromProps,
    isDisabled,
    ...rest
  } = props;

  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);

  const togglePasswordVisibilityHandler = () => {
    setIsPasswordRevealed((old) => !old);
  };

  const input =
    typeFromProps === "password" ? (
      <Aria.Group
        className={passwordFieldStyles.inputGroup}
        id={styles.inputGroup}
      >
        <ReactAriaControlledValueFix
          inputContext={Aria.InputContext}
          props={props}
        >
          <Aria.Input
            form={form}
            placeholder={placeholder}
            className={passwordFieldStyles.input}
            ref={ref}
          />
        </ReactAriaControlledValueFix>
        <TogglePasswordVisibilityButton
          className={passwordFieldStyles.button}
          isDisabled={isDisabled}
          isVisible={isPasswordRevealed}
          onPress={togglePasswordVisibilityHandler}
        />
      </Aria.Group>
    ) : (
      <ReactAriaControlledValueFix
        inputContext={Aria.InputContext}
        props={props}
      >
        <Aria.Input
          form={form}
          placeholder={placeholder}
          className={styles.textField}
          ref={ref}
        />
      </ReactAriaControlledValueFix>
    );

  return (
    <ClearPropsContext>
      {typeFromProps === "password" && children}
      <TextFieldBase
        {...rest}
        input={input}
        isDisabled={isDisabled}
        isPasswordRevealed={isPasswordRevealed}
      >
        {typeFromProps !== "password" && children}
      </TextFieldBase>
    </ClearPropsContext>
  );
});

export default TextField;
