import React from "react";
import styles from "./CheckboxButton.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { CheckboxProps } from "@/components/Checkbox";
import { Checkbox } from "@/components/Checkbox";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface CheckboxButtonProps
  extends CheckboxProps,
    FlowComponentProps {}

export const CheckboxButton = flowComponent("CheckboxButton", (props) => {
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
});

export default CheckboxButton;
