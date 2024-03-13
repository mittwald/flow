import React, { FC } from "react";
import styles from "./NavigationItem.module.scss";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { Link as LinkComponent, LinkProps } from "@/components/Link";

export interface NavigationItemProps extends Omit<LinkProps, "slot"> {
  isCurrent?: boolean;
}

export const NavigationItem: FC<NavigationItemProps> = (props) => {
  const {
    isCurrent,
    children,
    linkComponent: Link = LinkComponent,
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
};
