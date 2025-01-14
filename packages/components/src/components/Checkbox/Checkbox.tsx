import type { PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import clsx from "clsx";
import styles from "./Checkbox.module.scss";
import {
  IconCheckboxChecked,
  IconCheckboxEmpty,
  IconCheckboxIndeterminate,
} from "~/components/Icon/components/icons";
import { ClearPropsContext } from "~/lib/propsContext";
import type { FlowComponentProps } from "~/lib/componentFactory/flowComponent";
import { flowComponent } from "~/lib/componentFactory/flowComponent";

export interface CheckboxProps
  extends PropsWithChildren<Omit<Aria.CheckboxProps, "children">>,
    FlowComponentProps {}

/** @flr-generate all */
export const Checkbox = flowComponent("Checkbox", (props) => {
  const { children, className, ref, ...rest } = props;

  const rootClassName = clsx(styles.checkbox, className);

  return (
    <ClearPropsContext>
      <Aria.Checkbox {...rest} className={rootClassName} ref={ref}>
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
    </ClearPropsContext>
  );
});

export default Checkbox;
