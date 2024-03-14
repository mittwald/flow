import React, {
  ComponentProps,
  ComponentType,
  FC,
  PropsWithChildren,
} from "react";
import styles from "./NavigationItem.module.scss";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import * as Aria from "react-aria-components";

export interface NavigationItemProps
  extends PropsWithChildren<Omit<Aria.LinkProps, "children" | "slot">> {
  isCurrent?: boolean;
  linkComponent?: ComponentType<Omit<ComponentProps<"a">, "ref">>;
}

export const NavigationItem: FC<NavigationItemProps> = (props) => {
  const {
    isCurrent,
    children,
    linkComponent: Link = Aria.Link,
    ...linkProps
  } = useProps("NavigationItem", props);

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
};
