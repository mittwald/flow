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
import { useObjectRef } from "@react-aria/utils";
import { useMakeFocusable } from "@/lib/hooks/dom/useMakeFocusable";

export interface CheckboxProps
  extends PropsWithChildren<Omit<Aria.CheckboxProps, "children">>,
    FlowComponentProps {
  inputClassName?: string;
}

/** @flr-generate all */
export const Checkbox = flowComponent("Checkbox", (props) => {
  const { children, className, ref, inputClassName, ...rest } = props;

  const { FieldErrorView, fieldPropsContext, fieldProps } =
    useFieldComponent(props);

  const localCheckboxRef = useObjectRef(ref);
  useMakeFocusable(localCheckboxRef);

  return (
    <div
      {...fieldProps}
      className={clsx(styles.checkbox, className, fieldProps.className)}
      ref={localCheckboxRef}
    >
      <Aria.Checkbox {...rest} className={clsx(inputClassName, styles.input)}>
        {({ isSelected, isIndeterminate }) => (
          <PropsContextProvider props={fieldPropsContext}>
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
