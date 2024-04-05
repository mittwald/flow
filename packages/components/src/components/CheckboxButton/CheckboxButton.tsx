import React, { FC } from "react";
import styles from "./CheckboxButton.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { Checkbox, CheckboxProps } from "@/components/Checkbox";

export interface CheckboxButtonProps extends CheckboxProps {}

export const CheckboxButton: FC<CheckboxButtonProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.checkboxButton, className);

  const propsContext: PropsContext = {
    Text: {
      className: styles.label,
    },
    Content: {
      className: styles.content,
    },
  };

  return (
    <Checkbox {...rest} className={rootClassName}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Checkbox>
  );
};

export default CheckboxButton;
