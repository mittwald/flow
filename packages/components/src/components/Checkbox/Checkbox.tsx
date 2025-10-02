import {
  IconCheckboxChecked,
  IconCheckboxEmpty,
  IconCheckboxIndeterminate,
} from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Checkbox.module.scss";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import { PropsContextProvider } from "@/lib/propsContext";

export interface CheckboxProps
  extends PropsWithChildren<Omit<Aria.CheckboxProps, "children">>,
    FlowComponentProps<HTMLLabelElement> {}

/** @flr-generate all */
export const Checkbox = flowComponent("Checkbox", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.checkbox, className);

  const { FieldErrorView, propsContext, mergedRootClassName } =
    useFieldComponent(props);

  return (
    <div className={mergedRootClassName}>
      <Aria.Checkbox {...rest} className={rootClassName} ref={ref}>
        {({ isSelected, isIndeterminate }) => (
          <PropsContextProvider props={propsContext}>
            {isSelected ? (
              <IconCheckboxChecked className={styles.icon} />
            ) : isIndeterminate ? (
              <IconCheckboxIndeterminate className={styles.icon} />
            ) : (
              <IconCheckboxEmpty className={styles.icon} />
            )}
            {children}
          </PropsContextProvider>
        )}
      </Aria.Checkbox>
      <FieldErrorView />
    </div>
  );
});

export default Checkbox;
