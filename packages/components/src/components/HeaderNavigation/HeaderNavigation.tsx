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
import type { PropsWithClassName } from "@/lib/types/props";

export interface HeaderNavigationProps
  extends PropsWithChildren<ComponentProps<"nav">>,
    PropsWithClassName {
  /** @default "primary" */
  color?: "primary" | "dark" | "light";
}

export const HeaderNavigation: FC<HeaderNavigationProps> = (props) => {
  const { children, className, color = "primary", ...rest } = props;

  const rootClassName = clsx(styles.headerNavigation, styles[color], className);

  const propsContext: PropsContext = {
    Link: {
      wrapWith: <li />,
      className: styles.link,
      unstyled: true,
      children: dynamic((props) => (
        <EmulatedBoldText>{props.children}</EmulatedBoldText>
      )),
    },
    Button: {
      className: styles.button,
      color,
      variant: "plain",
      wrapWith: <li />,
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
