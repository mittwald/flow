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

export interface CheckboxProps
  extends PropsWithChildren<Omit<Aria.CheckboxProps, "children">>,
    FlowComponentProps<HTMLLabelElement> {
  /** @internal */
  inCheckboxGroup?: boolean;
}

/** @flr-generate all */
export const Checkbox = flowComponent("Checkbox", (props) => {
  const {
    children,
    className,
    ref,
    inCheckboxGroup,
    value,
    isDisabled,
    ...rest
  } = props;

  console.log(rest);

  const rootClassName = clsx(styles.checkbox, className);

  return (
    <Aria.Checkbox
      {...(inCheckboxGroup ? {} : rest)}
      isDisabled={isDisabled}
      className={rootClassName}
      ref={ref}
      value={value}
    >
      {({ isSelected, isIndeterminate }) => (
        <>
          {isSelected ? (
            <IconCheckboxChecked className={styles.icon} />
          ) : isIndeterminate ? (
            <IconCheckboxIndeterminate className={styles.icon} />
          ) : (
            <IconCheckboxEmpty className={styles.icon} />
          )}
          {children}
        </>
      )}
    </Aria.Checkbox>
  );
});

export default Checkbox;
