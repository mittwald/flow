export * from "./view";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import { TunnelExit, TunnelProvider } from "@mittwald/react-tunnel";
import clsx from "clsx";
import * as Aria from "react-aria-components";
import styles from "./Heading.module.scss";

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
    <ClearPropsContextView>
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
    </ClearPropsContextView>
  );
});

export default Heading;
