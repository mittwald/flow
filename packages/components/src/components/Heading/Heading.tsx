import React from "react";
import styles from "./Heading.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import * as Aria from "react-aria-components";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { useAltKeySelectionProps } from "@/lib/hooks/useAltKeySelectionProps";

export interface HeadingProps extends Aria.HeadingProps, FlowComponentProps {
  /** The font size of the heading. */
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl";
  /** The color of the heading. @default "primary" */
  color?: "primary" | "dark" | "light";
}

export const Heading = flowComponent("Heading", (props) => {
  const {
    children,
    className,
    level = 2,
    color = "primary",
    size,
    refProp: ref,
    ...rest
  } = props;

  const altKeySelectionProps = useAltKeySelectionProps(props);

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
          {...altKeySelectionProps}
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
