import React from "react";
import styles from "./CheckboxButton.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import type { CheckboxProps } from "@/components/Checkbox";
import { Checkbox } from "@/components/Checkbox";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface CheckboxButtonProps
  extends CheckboxProps,
    FlowComponentProps<HTMLLabelElement> {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const CheckboxButton = flowComponent("CheckboxButton", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.checkboxButton, className);

  const propsContext: PropsContext = {
    Text: {
      className: styles.label,
    },
    Content: {
      clearPropsContext: true,
      className: styles.content,
    },
  };

  return (
    <ClearPropsContext>
      <Checkbox {...rest} className={rootClassName} ref={ref}>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </Checkbox>
    </ClearPropsContext>
  );
});

export default CheckboxButton;
