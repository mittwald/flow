import React, { FC, PropsWithChildren } from "react";
import styles from "./NavigationItem.module.scss";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface NavigationItemProps
  extends PropsWithChildren<Omit<Aria.LinkProps, "children">> {
  isCurrent?: boolean;
}

export const NavigationItem: FC<NavigationItemProps> = (props) => {
  const { children, isCurrent, className, ...rest } = props;

  const rootClassName = clsx(styles.navigationItem, className);

  const propsContext: PropsContext = {
    Text: {
      className: styles.text,
    },
    Icon: {
      className: styles.icon,
    },
  };

  return (
    <li>
      <Aria.Link
        className={rootClassName}
        aria-current={isCurrent ? "page" : false}
        {...rest}
      >
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </Aria.Link>
    </li>
  );
};
