import type { RadioProps } from "@/components/RadioGroup";
import { Radio } from "@/components/RadioGroup";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import styles from "./RadioButton.module.scss";

export interface RadioButtonProps extends RadioProps, FlowComponentProps {}

/** @flr-generate all */
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
      <ClearPropsContextView>
        <Radio {...rest} className={rootClassName} ref={ref}>
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </Radio>
      </ClearPropsContextView>
    );
  },
);

export default RadioButton;
