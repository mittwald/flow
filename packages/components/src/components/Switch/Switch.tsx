import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./Switch.module.scss";
import clsx from "clsx";
import { IconCheck, IconClose } from "@/components/Icon/components/icons";

export interface SwitchProps
  extends PropsWithChildren<Omit<Aria.SwitchProps, "children">> {
  /** @default "trailing" */
  labelPosition?: "leading" | "trailing";
}

export const Switch: FC<SwitchProps> = (props) => {
  const { children, className, labelPosition = "trailing", ...rest } = props;

  const rootClassName = clsx(
    styles.switch,
    styles[`label-${labelPosition}`],
    className,
  );

  return (
    <Aria.Switch {...rest} className={rootClassName}>
      {({ isSelected }) => (
        <>
          <div className={styles.track}>
            <div className={styles.handle}>
              {isSelected ? <IconCheck size="s" /> : <IconClose size="s" />}
            </div>
          </div>
          {children}
        </>
      )}
    </Aria.Switch>
  );
};

export default Switch;
