import type { AlphaColor, PropsWithElementType } from "@/lib/types/props";
import styles from "./Heading.module.scss";
import { styleClassname } from "@/lib/scss/selectors";
import clsx from "clsx";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import * as Aria from "react-aria-components";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";

export interface HeadingProps
  extends
    Aria.HeadingProps,
    FlowComponentProps,
    PropsWithElementType<"span" | "p"> {
  /** The font size of the heading. */
  size?: "xs" | "s" | "m" | "l" | "xl" | "xxl";
  /** The color of the heading. @default "default" */
  color?: "default" | "danger" | "unavailable" | AlphaColor;
  /** The text-wrap property of the text. @default undefined */
  wrap?: "wrap" | "balance";
}

/**
 * The font size each heading level renders at — the TypeScript half of the
 * level-based `--font-size` rules in Heading.module.scss. Levels 4 to 6 fall
 * through to the `xs` default.
 */
const sizeByLevel: Record<number, NonNullable<HeadingProps["size"]>> = {
  1: "xl",
  2: "m",
  3: "s",
};

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
    elementType,
    ...rest
  } = props;

  const rootClassName = clsx(
    styles.heading,
    size && styles[`size-${size}`],
    color !== "default" && styles[color],
    wrap && styles[`wrap-${wrap}`],
    elementType && styleClassname(styles, `h${level}`),
    className,
  );

  const Element = elementType ?? Aria.Heading;

  const effectiveSize = size ?? sizeByLevel[level] ?? "xs";
  const buttonSize =
    effectiveSize === "xl" || effectiveSize === "xxl" ? "m" : "s";

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
    Button: {
      tunnel: {
        id: "headingContent",
        component: "Heading",
      },
      size: buttonSize,
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
      <Element className={rootClassName} {...rest} ref={ref} level={level}>
        <span className={styles.headingText}>{children}</span>
        <span className={styles.headingContent}>
          <UiComponentTunnelExit id="headingContent" component="Heading" />
        </span>
      </Element>
    </PropsContextProvider>
  );
});

export default Heading;
