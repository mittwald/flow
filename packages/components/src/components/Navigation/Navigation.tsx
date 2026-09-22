import type { ComponentProps, PropsWithChildren, ReactNode } from "react";
import { Children } from "react";
import styles from "./Navigation.module.scss";
import clsx from "clsx";
import { dynamic, PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { ComponentPropsContext } from "@/lib/propsContext/types";
import { LinkListTunnelExit } from "@/components/Navigation/components/LinkListTunnelExit/LinkListTunnelExit";
import { containsTextChild } from "@/lib/react/remote";

export interface NavigationProps
  extends
    PropsWithChildren<ComponentProps<"nav">>,
    PropsWithClassName,
    FlowComponentProps<HTMLElement> {}

/**
 * A bare text node is an anonymous flex item that no rule can reach, so give
 * the label an element the item can truncate.
 */
const wrapTextInLabel = (children: ReactNode): ReactNode =>
  Children.map(children, (child) =>
    containsTextChild(child) ? <span>{child}</span> : child,
  );

/** @flr-generate all */
export const Navigation = flowComponent("Navigation", (props) => {
  const { className, children, ref, ...rest } = props;

  const rootClassName = clsx(styles.navigation, className);

  const linkPropsContext: ComponentPropsContext<"Link"> = {
    wrapWith: <li />,
    className: styles.item,
    unstyled: true,
    children: dynamic((linkProps) => wrapTextInLabel(linkProps.children)),
    Icon: {
      className: styles.icon,
      size: "m",
    },
    Badge: { className: styles.badge },
    AlertBadge: { className: styles.badge },
    CounterBadge: { className: styles.badge },
  };

  return (
    <PropsContextProvider
      props={{
        Link: {
          ...linkPropsContext,
          tunnel: {
            id: "links",
            component: "Navigation",
          },
        },
        NavigationGroup: {
          Link: linkPropsContext,
        },
      }}
    >
      <nav className={rootClassName} role="navigation" {...rest} ref={ref}>
        <LinkListTunnelExit id="links" component="Navigation" />
        {children}
      </nav>
    </PropsContextProvider>
  );
});

export default Navigation;
