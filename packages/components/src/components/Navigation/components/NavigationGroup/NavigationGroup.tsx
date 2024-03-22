import React, { ComponentProps, FC, PropsWithChildren } from "react";
import clsx from "clsx";
import styles from "./NavigationGroup.module.scss";

export interface NavigationGroupProps
  extends PropsWithChildren<ComponentProps<"ul">> {}

export const NavigationGroup: FC<NavigationGroupProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.navigationGroup, className);

  return (
    <ul {...rest} className={rootClassName}>
      {children}
    </ul>
  );
};

export default NavigationGroup;
