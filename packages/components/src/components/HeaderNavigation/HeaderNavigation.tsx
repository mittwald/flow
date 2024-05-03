import type { ComponentProps, FC, PropsWithChildren } from "react";
import React from "react";
import { type PropsContext, PropsContextProvider } from "@/lib/propsContext";
import clsx from "clsx";
import styles from "./HeaderNavigation.module.scss";
import { EmulatedBoldText } from "@/components/EmulatedBoldText";
import type { PropsWithClassName } from "@/lib/types/props";

export interface HeaderNavigationProps
  extends PropsWithChildren<ComponentProps<"nav">>,
    PropsWithClassName {
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
      render: (Link, props) => (
        <li>
          <Link {...props} className={styles.link} unstyled>
            <EmulatedBoldText>{props.children}</EmulatedBoldText>
          </Link>
        </li>
      ),
    },
    Button: {
      render: (Button, props) => (
        <li>
          <Button
            {...props}
            className={styles.button}
            variant="plain"
            inverse={inverse}
          />
        </li>
      ),
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
