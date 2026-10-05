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
import { SkeletonRawText } from "@/components/SkeletonMode/components/SkeletonRawText";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";

export interface CheckboxProps
  extends
    PropsWithChildren<
      Omit<Aria.CheckboxProps, "children" | "ref" | "inputRef">
    >,
    FlowComponentProps<HTMLInputElement> {
  /** The class name of the underlying input element. */
  inputClassName?: string;
}

/** @flr-generate all */
export const Checkbox = flowComponent("Checkbox", (props) => {
  const { children, className, ref, inputClassName, ...rest } = props;

  const {
    FieldErrorView,
    FieldErrorCaptureContext,
    fieldPropsContext,
    wrapperProps,
    controlProps,
    skeletonProps,
  } = useFieldComponent(props, "Checkbox");

  const inputRef = useObjectRef(ref);
  const isSkeleton = useSkeletonMode();

  const renderIcon = (isSelected: boolean, isIndeterminate: boolean) => {
    const icon = isSelected ? (
      <IconCheckboxChecked className={styles.icon} />
    ) : isIndeterminate ? (
      <IconCheckboxIndeterminate className={styles.icon} />
    ) : (
      <IconCheckboxEmpty className={styles.icon} />
    );

    return isSkeleton ? (
      <span className={styles.skeletonIcon}>
        <SkeletonModeReset>{icon}</SkeletonModeReset>
      </span>
    ) : (
      icon
    );
  };

  return (
    <div
      {...skeletonProps}
      className={clsx(styles.checkbox, className, wrapperProps.className)}
    >
      <FieldErrorCaptureContext>
        <Aria.Checkbox
          {...rest}
          aria-describedby={controlProps["aria-describedby"]}
          inputRef={inputRef}
          className={clsx(inputClassName, styles.input)}
        >
          {({ isSelected, isIndeterminate }) => (
            <PropsContextProvider props={fieldPropsContext}>
              {renderIcon(isSelected, isIndeterminate)}
              <SkeletonRawText>{children}</SkeletonRawText>
            </PropsContextProvider>
          )}
        </Aria.Checkbox>
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </div>
  );
});

export default Checkbox;
