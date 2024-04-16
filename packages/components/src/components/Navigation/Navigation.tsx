import type { ComponentProps, FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Navigation.module.scss";
import clsx from "clsx";
import { deepFindOfType } from "@/lib/react/deepFindOfType";
import { NavigationGroup } from "@/components/Navigation";
import { Wrap } from "@/components/Wrap";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";

export interface NavigationProps
  extends PropsWithChildren<ComponentProps<"nav">> {
  className?: string;
}

export const Navigation: FC<NavigationProps> = (props) => {
  const { className, children, ...rest } = props;

  const rootClassName = clsx(styles.navigation, className);

  const hasGroups = !!deepFindOfType(children, NavigationGroup);

  const propsContext: PropsContext = {
    Label: {
      className: styles.label,
    },
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
      <PropsContextProvider props={propsContext}>
        <Wrap if={!hasGroups}>
          <NavigationGroup>{children}</NavigationGroup>
        </Wrap>
      </PropsContextProvider>
    </nav>
  );
};

export default Navigation;
