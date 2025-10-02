import styles from "./CheckboxButton.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { CheckboxProps } from "@/components/Checkbox";
import { Checkbox } from "@/components/Checkbox";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";

export interface CheckboxButtonProps
  extends CheckboxProps,
    FlowComponentProps<HTMLLabelElement> {}

/** @flr-generate all */
export const CheckboxButton = flowComponent("CheckboxButton", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.checkboxButton, className);
  const { propsContext, mergedRootClassName } = useFieldComponent(
    props,
    rootClassName,
  );

  const mergedPropsContext: PropsContext = {
    Text: {
      className: styles.label,
    },
    Content: {
      className: styles.content,
    },
    ...propsContext,
  };

  return (
    <Checkbox {...rest} className={mergedRootClassName} ref={ref}>
      <PropsContextProvider props={mergedPropsContext}>
        {children}
      </PropsContextProvider>
    </Checkbox>
  );
});

export default CheckboxButton;
