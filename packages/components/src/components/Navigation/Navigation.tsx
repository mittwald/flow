import React, { FC } from "react";
import styles from "./Navigation.module.css";
import clsx from "clsx";
import { AriaMenuProps } from "react-aria";
import { useTreeState } from "react-stately";
import { NavigationItemNodeFactory } from "./components/NavigationItem";
import { useNavigation } from "@/hooks/useNavigation";

export interface NavigationProps
  extends Pick<
    AriaMenuProps<never>,
    "children" | "disabledKeys" | "aria-label" | "aria-labelledby"
  > {
  className?: string;
}

export const Navigation: FC<NavigationProps> = (props) => {
  const { className: classNameFromProps } = props;

  const className = clsx(classNameFromProps, styles.root);
  const state = useTreeState(props);
  const ref = React.useRef<HTMLElement>(null);
  const { menuProps } = useNavigation(props, state, ref);

  return (
    <nav {...menuProps} className={className} ref={ref}>
      <ul className={styles.list}>
        {Array.from(state.collection).map((item) => (
          <NavigationItemNodeFactory state={state} item={item} key={item.key} />
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
