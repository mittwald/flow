import React, { ComponentType, FC } from "react";
import { Item, ItemProps, TreeState } from "react-stately";
import { Node } from "@react-types/shared";
import styles from "./NavigationItem.module.css";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { useNavigationItem } from "@/hooks/useNavigationItem";

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
  const { menuItemProps } = useNavigationItem({ key: item.key }, state, ref);

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
        {...menuItemProps}
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
