import {
  IconCheckboxChecked,
  IconCheckboxEmpty,
  IconCheckboxIndeterminate,
} from "@/components/Icon/components/icons";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Checkbox.module.scss";

export interface CheckboxProps
  extends PropsWithChildren<Omit<Aria.CheckboxProps, "children">>,
    FlowComponentProps {}

/** @flr-generate all */
export const Checkbox = flowComponent<"Checkbox", HTMLLabelElement>(
  "Checkbox",
  (props) => {
    const { children, className, ref, ...rest } = props;

    const rootClassName = clsx(styles.checkbox, className);

    return (
      <ClearPropsContextView>
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
      </ClearPropsContextView>
    );
  },
);

export default Checkbox;
