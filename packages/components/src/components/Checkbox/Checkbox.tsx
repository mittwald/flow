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
import { useObjectRef } from "react-aria";

export interface CheckboxProps
  extends
    PropsWithChildren<
      Omit<Aria.CheckboxProps, "children" | "ref" | "inputRef">
    >,
    FlowComponentProps<HTMLInputElement> {
  inputClassName?: string;
}

/** @flr-generate all */
export const Checkbox = flowComponent("Checkbox", (props) => {
  const { children, className, ref, inputClassName, ...rest } = props;

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    fieldProps,
  } = useFieldComponent(props);

  const inputRef = useObjectRef(ref);

  return (
    <div
      {...fieldProps}
      className={clsx(styles.checkbox, className, fieldProps.className)}
    >
      <FieldErrorCaptureContext>
        <Aria.Checkbox
          {...rest}
          inputRef={inputRef}
          className={clsx(inputClassName, styles.input)}
        >
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
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </div>
  );
});

export default Checkbox;
