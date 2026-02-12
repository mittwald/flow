export * from "./view";
import styles from "./Heading.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import * as Aria from "react-aria-components";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";

export interface HeadingProps extends Aria.HeadingProps, FlowComponentProps {
  /** The font size of the heading. */
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl";
  /** The color of the heading. @default "primary" */
  color?: "danger" | "unavailable" | "dark" | "light";
  /** The text-wrap property of the text. @default undefined */
  wrap?: "wrap" | "balance";
}

/** @flr-generate all */
export const Heading = flowComponent("Heading", (props) => {
  const {
    children,
    className,
    level = 2,
    color,
    wrap,
    size,
    ref,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.heading,
    size && styles[size],
    color && styles[color],
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
    AlertText: {
      Icon: {
        className: styles.icon,
      },
    },
  };

  return (
    <PropsContextProvider props={propsContext}>
      <TunnelProvider>
        <Aria.Heading
          level={level}
          className={rootClassName}
          {...rest}
          ref={ref}
        >
          <span className={styles.headingText}>{children}</span>
          <span className={styles.headingContent}>
            <TunnelExit id="headingContent" />
          </span>
        </Aria.Heading>
      </TunnelProvider>
    </PropsContextProvider>
  );
});

export default Heading;
