import React, { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./Navigation.module.scss";
import clsx from "clsx";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface NavigationProps
  extends PropsWithChildren<ComponentProps<"nav">> {
  className?: string;
}

export const Navigation: FC<NavigationProps> = (props) => {
  const { className, children, ...rest } = props;

  const rootClassName = clsx(styles.navigation, className);

  const propsContext: PropsContext = {
    Link: {
      hoc: (link) => <li>{link}</li>,
      className: styles.item,
      unstyled: true,
      Text: {
        className: styles.text,
      },
      Icon: {
        className: styles.icon,
      },
    },
  };

  return (
    <nav className={rootClassName} role="navigation" {...rest}>
      <ul>
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </ul>
    </nav>
  );
};

export default Navigation;
