export * from "./view";
import React from "react";
import styles from "./Heading.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import * as Aria from "react-aria-components";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export interface HeadingProps extends Aria.HeadingProps, FlowComponentProps {
  /** The font size of the heading. */
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl";
  /** The color of the heading. @default "primary" */
  color?: "primary" | "dark" | "light";
}

/** @flr-generate all */
export const Heading = flowComponent("Heading", (props) => {
  const {
    children,
    className,
    level = 2,
    color = "primary",
    size,
    ref,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.heading,
    size && styles[size],
    styles[color],
    className,
  );

  const propsContext: PropsContext = {
    Icon: {
      "aria-hidden": true,
      className: styles.icon,
    },
    AlertBadge: {
      tunnelId: "headingContent",
    },
    Badge: {
      tunnelId: "headingContent",
    },
    ContextualHelpTrigger: {
      tunnelId: "headingContent",
      Button: {
        tunnelId: null,
      },
    },
  };

  return (
    <ClearPropsContext>
      <TunnelProvider>
        <Aria.Heading
          level={level}
          className={rootClassName}
          {...rest}
          ref={ref}
        >
          <span className={styles.headingText}>
            <PropsContextProvider props={propsContext}>
              {children}
            </PropsContextProvider>
          </span>
          <span className={styles.headingContent}>
            <TunnelExit id="headingContent" />
          </span>
        </Aria.Heading>
      </TunnelProvider>
    </ClearPropsContext>
  );
});

export default Heading;
