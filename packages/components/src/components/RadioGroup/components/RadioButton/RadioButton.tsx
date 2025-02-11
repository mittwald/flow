import React from "react";
import styles from "./RadioButton.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { RadioProps } from "@/components/RadioGroup";
import { Radio } from "@/components/RadioGroup";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface RadioButtonProps extends RadioProps, FlowComponentProps {}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const RadioButton = flowComponent<"RadioButton", HTMLLabelElement>(
  "RadioButton",
  (props) => {
    const { children, className, ref, ...rest } = props;

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
      <ClearPropsContext>
        <Radio {...rest} className={rootClassName} ref={ref}>
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </Radio>
      </ClearPropsContext>
    );
  },
);

export default RadioButton;
