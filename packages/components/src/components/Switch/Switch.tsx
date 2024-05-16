import type { PropsWithChildren } from "react";
import React from "react";
import * as Aria from "react-aria-components";
import styles from "./Switch.module.scss";
import clsx from "clsx";
import { IconCheck, IconClose } from "@/components/Icon/components/icons";
import { Label } from "@/components/Label";
import { ClearPropsContext } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface SwitchProps
  extends PropsWithChildren<Omit<Aria.SwitchProps, "children">>,
    FlowComponentProps {
  /** @default "trailing" */
  labelPosition?: "leading" | "trailing";
}

export const Switch = flowComponent("Switch", (props) => {
  const {
    children,
    className,
    labelPosition = "trailing",
    refProp: ref,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.switch,
    styles[`label-${labelPosition}`],
    className,
  );

  return (
    <ClearPropsContext>
      <Aria.Switch {...rest} className={rootClassName} ref={ref}>
        {({ isSelected }) => (
          <>
            <div className={styles.track}>
              <div className={styles.handle}>
                {isSelected ? <IconCheck size="s" /> : <IconClose size="s" />}
              </div>
            </div>
            <Label className={styles.label}>{children}</Label>
          </>
        )}
      </Aria.Switch>
    </ClearPropsContext>
  );
});

export default Switch;
