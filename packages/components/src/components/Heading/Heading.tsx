import type { AlphaColor } from "@/lib/types/props";
import styles from "./Heading.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import * as Aria from "react-aria-components";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import { headingTunnelProviderId } from "./config";

export * from "./view";

export interface HeadingProps extends Aria.HeadingProps, FlowComponentProps {
  /** The font size of the heading. */
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl";
  /** The color of the heading. @default "primary" */
  color?: "primary" | "danger" | "unavailable" | AlphaColor;
  /** The text-wrap property of the text. @default undefined */
  wrap?: "wrap" | "balance";
}

/** @flr-generate all */
export const Heading = flowComponent("Heading", (props) => {
  const {
    children,
    className,
    level = 2,
    color = "primary",
    wrap,
    size,
    ref,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.heading,
    size && styles[`size-${size}`],
    styles[color],
    wrap && styles[`wrap-${wrap}`],
    className,
  );

  const propsContext: PropsContext = {
    Icon: {
      "aria-hidden": true,
      className: styles.icon,
    },
    AlertBadge: {
      tunnelId: "headingContent",
      tunnelProviderId: headingTunnelProviderId,
    },
    Badge: {
      tunnelId: "headingContent",
      tunnelProviderId: headingTunnelProviderId,
    },
    ContextualHelpTrigger: {
      tunnelId: "headingContent",
      tunnelProviderId: headingTunnelProviderId,
      Button: {
        tunnelId: null,
        tunnelProviderId: null,
      },
    },
    AlertText: {
      Icon: {
        className: styles.icon,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <TunnelProvider id={headingTunnelProviderId}>
        <Aria.Heading
          level={level}
          className={rootClassName}
          {...rest}
          ref={ref}
        >
          <span className={styles.headingText}>{children}</span>
          <span className={styles.headingContent}>
            <TunnelExit
              id="headingContent"
              providerId={headingTunnelProviderId}
            />
          </span>
        </Aria.Heading>
      </TunnelProvider>
    </PropsContextProvider>
  );
});

export default Heading;
