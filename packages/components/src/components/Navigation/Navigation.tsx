import React from "react";
import styles from "./Navigation.module.scss";
import { AriaMenuProps } from "react-aria";
import { useTreeState } from "react-stately";
import { NavigationItem } from "./components/NavigationItem/NavigationItem";
import { useNavigation } from "@/hooks/useNavigation";
import clsx from "clsx";

export interface NavigationProps<T = never> extends AriaMenuProps<T> {
  className?: string;
}

export function Navigation<T extends object>(props: NavigationProps<T>) {
  const { className } = props;

  const state = useTreeState(props);
  const ref = React.useRef<HTMLElement>(null);
  const { menuProps } = useNavigation(props, state, ref);

  const rootClassName = clsx(styles.navigation, className);

  return (
    <nav {...menuProps} className={rootClassName} ref={ref}>
      <ul className={styles.list}>
        {Array.from(state.collection).map((item) => (
          <NavigationItem state={state} item={item} key={item.key} />
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;
