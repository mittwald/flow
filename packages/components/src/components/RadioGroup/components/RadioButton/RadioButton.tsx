import React, { FC } from "react";
import styles from "./RadioButton.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { Radio, RadioProps } from "@/components/RadioGroup";

export interface RadioButtonProps extends RadioProps {}

export const RadioButton: FC<RadioButtonProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.radioButton, className);

  const propsContext: PropsContext = {
    Text: {
      className: styles.label,
    },
    Content: {
      className: styles.content,
    },
  };

  return (
    <Radio {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Radio>
  );
};

export default RadioButton;
