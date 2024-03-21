import React, { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./Navigation.module.scss";
import clsx from "clsx";
import { ClearPropsContext } from "@/lib/propsContext";

export interface NavigationProps
  extends PropsWithChildren<ComponentProps<"nav">> {
  className?: string;
}

export const Navigation: FC<NavigationProps> = (props) => {
  const { className, children, ...rest } = props;

  const rootClassName = clsx(styles.navigation, className);

  //   const hasGroups = !!deepFindOfType(children, NavigationGroup);

  return (
    <ClearPropsContext>
      <nav className={rootClassName} role="navigation" {...rest}>
        <ul>{children}</ul>
      </nav>
    </ClearPropsContext>
  );
};

export default Navigation;
