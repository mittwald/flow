import { IconCheck, IconClose } from "@/components/Icon/components/icons";
import { Label } from "@/components/Label";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Switch.module.scss";

export interface SwitchProps
  extends PropsWithChildren<Omit<Aria.SwitchProps, "children">>,
    FlowComponentProps {
  /**
   * Whether the label should appear before or after the switch. @default
   * "trailing"
   */
  labelPosition?: "leading" | "trailing";
}

/** @flr-generate all */
export const Switch = flowComponent<"Switch", HTMLLabelElement>(
  "Switch",
  (props) => {
    const {
      children,
      className,
      labelPosition = "trailing",
      ref,
      ...rest
    } = props;

    const rootClassName = clsx(
      styles.switch,
      styles[`label-${labelPosition}`],
      className,
    );

    return (
      <ClearPropsContextView>
        <Aria.Switch {...rest} className={rootClassName} ref={ref}>
          {({ isSelected }) => (
            <>
              <div className={styles.track}>
                <div className={styles.handle}>
                  {isSelected ? <IconCheck size="s" /> : <IconClose size="s" />}
                </div>
              </div>
              {children && <Label className={styles.label}>{children}</Label>}
            </>
          )}
        </Aria.Switch>
      </ClearPropsContextView>
    );
  },
);

export default Switch;
