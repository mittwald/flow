import styles from "./CheckboxButton.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { CheckboxProps } from "@/components/Checkbox";
import { Checkbox } from "@/components/Checkbox";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import { useFieldComponent } from "@/lib/hooks/useFieldComponent";
import {
  SkeletonModeReset,
  useSkeletonMode,
} from "@/components/SkeletonMode/skeletonModeContext";

export interface CheckboxButtonProps
  extends CheckboxProps, FlowComponentProps<HTMLInputElement> {}

/** @flr-generate all */
export const CheckboxButton = flowComponent("CheckboxButton", (props) => {
  const { children, className, inputClassName, ...rest } = props;

  const {
    fieldPropsContext,
    wrapperProps,
    controlProps,
    FieldErrorView,
    FieldErrorCaptureContext,
    skeletonProps,
  } = useFieldComponent(props, "CheckboxButton");

  const isSkeleton = useSkeletonMode();

  const mergedPropsContext: PropsContext = {
    Text: {
      className: styles.label,
    },
    Content: {
      className: styles.content,
    },
    ...fieldPropsContext,
  };

  const checkbox = (
    <Checkbox
      {...rest}
      aria-describedby={controlProps["aria-describedby"]}
      className={styles.checkbox}
      inputClassName={clsx(inputClassName, styles.input)}
    >
      <PropsContextProvider props={mergedPropsContext}>
        {children}
      </PropsContextProvider>
    </Checkbox>
  );

  return (
    <div
      {...skeletonProps}
      className={clsx(wrapperProps.className, styles.checkboxButton, className)}
    >
      <FieldErrorCaptureContext>
        {/* The whole button is the surface, its content draws no bars. */}
        {isSkeleton ? (
          <SkeletonModeReset>{checkbox}</SkeletonModeReset>
        ) : (
          checkbox
        )}
      </FieldErrorCaptureContext>
      <FieldErrorView />
    </div>
  );
});

export default CheckboxButton;
