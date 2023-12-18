import React, { ComponentType, FC } from "react";
import { Item, ItemProps, TreeState } from "react-stately";
import * as R from "remeda";
import { Node } from "@react-types/shared";
import styles from "./NavigationItem.module.css";
import { useMenuItem } from "react-aria";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";

interface AdditionalProps {
  isCurrent?: boolean;
}

export interface NavigationItemProps<T = never>
  extends ItemProps<T>,
    AdditionalProps {}

interface NavigationItemNodeFactoryProps<T = never> {
  state: TreeState<T>;
  item: Node<T>;
}

export const NavigationItemNodeFactory: FC<NavigationItemNodeFactoryProps> = (
  props,
) => {
  const { item, state } = props;
  const { isCurrent } = item.props as AdditionalProps;

  const ref = React.useRef(null);
  const { menuItemProps } = useMenuItem({ key: item.key }, state, ref);

  const correctedMenuItemProps = R.omit(menuItemProps, ["role"]);

  const propsContext: PropsContext = {
    text: {
      className: styles.text,
    },
    icon: {
      className: styles.icon,
    },
  };

  return (
    <li className={styles.root}>
      <a
        {...correctedMenuItemProps}
        ref={ref}
        className={styles.link}
        aria-current={isCurrent ? "page" : false}
      >
        <PropsContextProvider props={propsContext}>
          {item.rendered}
        </PropsContextProvider>
      </a>
    </li>
  );
};

export const NavigationItem = Item as ComponentType<NavigationItemProps>;
