import type { ComponentProps, FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./Navigation.module.scss";
import clsx from "clsx";
import { NavigationGroup } from "@/components/Navigation";
import { Wrap } from "@/components/Wrap";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import { deepHas } from "@/lib/react/deepHas";

export interface NavigationProps
  extends PropsWithChildren<ComponentProps<"nav">>,
    PropsWithClassName {}

/** @flr-generate all */
export const Navigation: FC<NavigationProps> = (props) => {
  const { className, children, ...rest } = props;

  const rootClassName = clsx(styles.navigation, className);

  const hasGroups = deepHas(children, NavigationGroup);

  const propsContext: PropsContext = {
    Link: {
      wrapWith: <li />,
      className: styles.item,
      unstyled: true,
      Text: {
        className: styles.text,
      },
      Icon: {
        className: styles.icon,
      },
    },
  };

  return (
    <nav className={rootClassName} role="navigation" {...rest}>
      <PropsContextProvider props={propsContext} mergeInParentContext>
        <Wrap if={!hasGroups}>
          <ul>{children}</ul>
        </Wrap>
      </PropsContextProvider>
    </nav>
  );
};

export default Navigation;
