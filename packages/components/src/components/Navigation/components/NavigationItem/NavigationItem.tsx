import React from "react";
import { TreeState } from "react-stately";
import { Node } from "@react-types/shared";
import styles from "./NavigationItem.module.scss";
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
    Text: {
      className: styles.text,
    },
    Icon: {
      className: styles.icon,
    },
    Skeleton: {
      className: styles.skeleton,
    },
  };

  return (
    <li className={styles.navigationItem}>
      <a {...menuItemProps} ref={ref} aria-current={isCurrent ? "page" : false}>
        <PropsContextProvider props={propsContext}>
          {item.rendered}
        </PropsContextProvider>
      </a>
    </li>
  );
}
