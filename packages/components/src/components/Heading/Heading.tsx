import type { AlphaColor } from "@/lib/types/props";
import styles from "./Heading.module.scss";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import * as Aria from "react-aria-components";
import { UiComponentTunnelExit } from "../UiComponentTunnel/UiComponentTunnelExit";

export interface HeadingProps extends Aria.HeadingProps, FlowComponentProps {
  /** The font size of the heading. */
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl";
  /** The color of the heading. @default "default" */
  color?: "default" | "danger" | "unavailable" | AlphaColor;
  /** The text-wrap property of the text. @default undefined */
  wrap?: "wrap" | "balance";
}

/** @flr-generate all */
export const Heading = flowComponent("Heading", (props) => {
  const {
    children,
    className,
    level = 2,
    color = "default",
    wrap,
    size,
    ref,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.heading,
    size && styles[`size-${size}`],
    color !== "default" && styles[color],
    wrap && styles[`wrap-${wrap}`],
    className,
  );

  const propsContext: PropsContext = {
    Icon: {
      "aria-hidden": true,
      className: styles.icon,
    },
    AlertBadge: {
      tunnel: {
        id: "headingContent",
        component: "Heading",
      },
    },
    Badge: {
      tunnel: {
        id: "headingContent",
        component: "Heading",
      },
    },
    ContextualHelpTrigger: {
      tunnel: {
        id: "headingContent",
        component: "Heading",
      },
      Button: {
        tunnel: null,
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
      <Aria.Heading level={level} className={rootClassName} {...rest} ref={ref}>
        <span className={styles.headingText}>{children}</span>
        <span className={styles.headingContent}>
          <UiComponentTunnelExit id="headingContent" component="Heading" />
        </span>
      </Aria.Heading>
    </PropsContextProvider>
  );
});

export default Heading;
