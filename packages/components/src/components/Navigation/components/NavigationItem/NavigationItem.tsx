import React, { ComponentProps, ComponentType, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import styles from "./NavigationItem.module.scss";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

export interface NavigationItemProps
  extends PropsWithChildren<Omit<Aria.LinkProps, "children" | "slot">> {
  isCurrent?: boolean;
  linkComponent?: ComponentType<Omit<ComponentProps<"a">, "ref">>;
}

export function NavigationItem(props: NavigationItemProps) {
  const {
    isCurrent,
    children,
    linkComponent: Link = Aria.Link,
    ...linkProps
  } = props;

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
      <Link
        {...linkProps}
        className={styles.navigationItem}
        aria-current={isCurrent ? "page" : false}
      >
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </Link>
    </li>
  );
}
