import React, { FC, PropsWithChildren } from "react";
import styles from "./RadioButton.module.scss";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { Radio } from "@/components/RadioGroup";

export interface RadioButtonProps
  extends PropsWithChildren<Omit<Aria.RadioProps, "children">> {}

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
