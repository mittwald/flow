import type { ComponentProps, PropsWithChildren } from "react";
import styles from "./Navigation.module.scss";
import clsx from "clsx";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import {
  flowComponent,
  type FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import type { ComponentPropsContext } from "@/lib/propsContext/types";

export interface NavigationProps
  extends
    PropsWithChildren<ComponentProps<"nav">>,
    PropsWithClassName,
    FlowComponentProps<HTMLElement> {}

/** @flr-generate all */
export const Navigation = flowComponent("Navigation", (props) => {
  const { className, children, ref, ...rest } = props;

  const rootClassName = clsx(styles.navigation, className);

  const linkPropsContext: ComponentPropsContext<"Link"> = {
    wrapWith: <li />,
    className: styles.item,
    unstyled: true,
    Icon: {
      className: styles.icon,
    },
    Badge: { className: styles.badge },
    CounterBadge: { className: styles.badge },
  };

  return (
    <PropsContextProvider
      props={{
        Link: {
          ...linkPropsContext,
          tunnelId: "links",
        },
        NavigationGroup: {
          Link: linkPropsContext,
        },
      }}
    >
      <TunnelProvider>
        <nav className={rootClassName} role="navigation" {...rest} ref={ref}>
          <ul>
            <TunnelExit id="links" />
          </ul>
          {children}
        </nav>
      </TunnelProvider>
    </PropsContextProvider>
  );
});

export default Navigation;
