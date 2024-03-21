import React, { ComponentProps, FC, PropsWithChildren } from "react";
import styles from "./Navigation.module.scss";
import clsx from "clsx";
import {
  ClearPropsContext,
  PropsContext,
  PropsContextProvider,
} from "@/lib/propsContext";
import { deepFindOfType } from "@/lib/react/deepFindOfType";
import { NavigationGroup } from "@/components/Navigation";
import { Wrap } from "@/components/Wrap";

export interface NavigationProps
  extends PropsWithChildren<ComponentProps<"nav">> {
  className?: string;
}

export const Navigation: FC<NavigationProps> = (props) => {
  const { className, children, ...rest } = props;

  const rootClassName = clsx(styles.navigation, className);

  const hasGroups = !!deepFindOfType(children, NavigationGroup);

  console.log(hasGroups);

  const propsContext: PropsContext = {
    Heading: {
      className: styles.heading,
      level: 3,
    },
  };

  return (
    <ClearPropsContext>
      <nav className={rootClassName} role="navigation" {...rest}>
        <PropsContextProvider props={propsContext}>
          <Wrap if={!hasGroups}>
            <NavigationGroup>{children}</NavigationGroup>
          </Wrap>
        </PropsContextProvider>
      </nav>
    </ClearPropsContext>
  );
};

export default Navigation;
