import type { ComponentProps, PropsWithChildren } from "react";
import React from "react";
import styles from "./Navigation.module.scss";
import clsx from "clsx";
import { type PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import ClearPropsContext from "@/components/ClearPropsContext";

export interface NavigationProps
  extends PropsWithChildren<ComponentProps<"nav">>,
    PropsWithClassName,
    FlowComponentProps<HTMLElement> {}

/** @flr-generate all */
export const Navigation = flowComponent("Navigation", (props) => {
  const { className, children, ref, ...rest } = props;

  const rootClassName = clsx(styles.navigation, className);

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
      tunnelId: "links",
    },
  };

  return (
    <ClearPropsContext>
      <TunnelProvider>
        <nav className={rootClassName} role="navigation" {...rest} ref={ref}>
          <PropsContextProvider props={propsContext} mergeInParentContext>
            <ul>
              <TunnelExit id="links" />
            </ul>
            {children}
          </PropsContextProvider>
        </nav>
      </TunnelProvider>
    </ClearPropsContext>
  );
});

export default Navigation;
