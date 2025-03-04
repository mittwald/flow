import type { CheckboxProps } from "@/components/Checkbox";
import { Checkbox } from "@/components/Checkbox";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import styles from "./CheckboxButton.module.scss";

export interface CheckboxButtonProps
  extends CheckboxProps,
    FlowComponentProps {}

/** @flr-generate all */
export const CheckboxButton = flowComponent<"CheckboxButton", HTMLLabelElement>(
  "CheckboxButton",
  (props) => {
    const { children, className, ref, ...rest } = props;

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
      <ClearPropsContextView>
        <Checkbox {...rest} className={rootClassName} ref={ref}>
          <PropsContextProvider props={propsContext}>
            {children}
          </PropsContextProvider>
        </Checkbox>
      </ClearPropsContextView>
    );
  },
);

export default CheckboxButton;
