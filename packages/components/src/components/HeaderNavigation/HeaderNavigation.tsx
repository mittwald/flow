import type { ComponentProps, FC, PropsWithChildren } from "react";
import React from "react";
import {
  dynamic,
  type PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import clsx from "clsx";
import styles from "./HeaderNavigation.module.scss";
import { EmulatedBoldText } from "@/components/EmulatedBoldText";

export interface HeaderNavigationProps
  extends PropsWithChildren<ComponentProps<"nav">> {
  className?: string;
  inverse?: boolean;
}

export const HeaderNavigation: FC<HeaderNavigationProps> = (props) => {
  const { children, className, inverse, ...rest } = props;

  const rootClassName = clsx(
    styles.headerNavigation,
    inverse && styles.inverse,
    className,
  );

  const propsContext: PropsContext = {
    Link: {
      hoc: (link) => <li>{link}</li>,
      className: styles.link,
      unstyled: true,
      children: dynamic((props) => (
        <EmulatedBoldText>{props.children}</EmulatedBoldText>
      )),
    },
    Button: {
      hoc: (button) => <li>{button}</li>,
      className: styles.button,
      style: "plain",
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

export default HeaderNavigation;
