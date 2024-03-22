import React, { ComponentProps, ComponentType, PropsWithChildren } from "react";
import styles from "./NavigationItem.module.scss";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import * as Aria from "react-aria-components";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";

export interface NavigationItemProps
  extends PropsWithChildren<Omit<Aria.LinkProps, "children" | "slot">>,
    FlowComponentProps {
  isCurrent?: boolean;
  linkComponent?: ComponentType<Omit<ComponentProps<"a">, "ref">>;
}

export const NavigationItem = flowComponent("NavigationItem", (props) => {
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
});
