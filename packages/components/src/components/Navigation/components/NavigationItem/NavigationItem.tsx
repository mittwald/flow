import React, { FC } from "react";
import { TreeState } from "react-stately";
import { Node } from "@react-types/shared";
import styles from "./NavigationItem.module.css";
import { PropsContext, PropsContextProvider } from "@/lib/propsContext";
import { useNavigationItem } from "@/hooks/useNavigationItem";
import { NavigationCollectionItemProps } from "@/components/Navigation/components/NavigationItem/NavigationCollectionItem";

interface NavigationItemProps<T = never> {
  state: TreeState<T>;
  item: Node<T>;
}

export function NavigationItem<T extends object>(
  props: NavigationItemProps<T>,
) {
  const { item, state } = props;
  const { isCurrent } = item.props as NavigationCollectionItemProps;

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
}
