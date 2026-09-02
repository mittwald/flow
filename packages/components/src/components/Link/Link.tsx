import type {
  ComponentProps,
  ComponentType,
  CSSProperties,
  MouseEvent,
  PropsWithChildren,
} from "react";
import { useContext } from "react";
import * as Aria from "react-aria-components";
import { dynamic, type PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import styles from "./Link.module.scss";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import {
  type AlphaColor,
  isAlphaColor,
  type PropsWithClassName,
} from "@/lib/types/props";
import { linkContext } from "@/components/Link/context";
import { Text } from "@/components/Text";
import { LinkIcon } from "@/components/Link/components/LinkIcon";
import { handleLinkClick, useRouter } from "@react-aria/utils";
import { UiComponentTunnelExit } from "@/components/UiComponentTunnel/UiComponentTunnelExit";
import { Wrap } from "@/components/Wrap";
import { extractTextFromFirstChild } from "@/lib/react/remote";

export interface LinkProps
  extends
    PropsWithChildren<Omit<Aria.LinkProps, "children" | "slot" | "className">>,
    FlowComponentProps<HTMLAnchorElement>,
    PropsWithClassName {
  /** Whether the link should be styled for being displayed inside a text. */
  inline?: boolean;
  /** An alternative link component. */
  linkComponent?: ComponentType<Omit<ComponentProps<"a">, "ref">>;
  /** The color of the link. @default "default" */
  color?: "default" | AlphaColor;
  /** Marks the link as the currently active one, e.g. in a navigation. */
  "aria-current"?: string;
  /** The name of the slot the link is placed in. */
  slot?: string;
  /** The whiteSpace css value of the element. */
  whiteSpace?: CSSProperties["whiteSpace"];
  /** The size of the element. @default "m" */
  size?: "s" | "m";
  /** @internal */
  unstyled?: boolean;
}

/** @flr-generate all */
export const Link = flowComponent("Link", (props) => {
  const {
    children,
    className,
    inline,
    linkComponent: linkComponentFromProps,
    color = "default",
    unstyled = false,
    "aria-current": ariaCurrent,
    ref,
    slot: ignoredSlotProp,
    style,
    whiteSpace,
    size = "m",
    onClickCapture: onClickCaptureFromProps,
    target,
    download,
    ...rest
  } = props;

  const { linkComponent: linkComponentFromContext } = useContext(linkContext);
  const Link = linkComponentFromProps
    ? (linkComponentFromProps as typeof Aria.Link)
    : props.href && linkComponentFromContext
      ? (linkComponentFromContext as typeof Aria.Link)
      : Aria.Link;

  const router = useRouter();

  /**
   * An interactive child (e.g. a Button) stops click propagation via React
   * Aria's `usePress`, so the anchor's own `onClick` never runs and navigation
   * falls back to a full page load. Handling it in the capture phase (top-down,
   * before the child) keeps navigation client-side. Only needed for React
   * Aria's `<a>`; custom link components handle navigation themselves.
   */
  const handleClickCapture =
    Link === Aria.Link && props.href
      ? (event: MouseEvent<HTMLAnchorElement>) => {
          onClickCaptureFromProps?.(event);
          if (event.target !== event.currentTarget) {
            handleLinkClick(event, router, props.href, props.routerOptions);
          }
        }
      : onClickCaptureFromProps;

  const rootClassName = unstyled
    ? className
    : clsx(
        styles.link,
        inline && styles.inline,
        isAlphaColor(color) && styles[color],
        size === "s" && styles["size-s"],
        className,
      );

  const propsContext: PropsContext = {
    Icon: {
      tunnel: {
        component: "Link",
        id: "icon",
      },
      className: styles.icon,
      size: "s",
    },
    AlertText: {
      className: styles.alertText,
    },
    AccentBox: { className: styles.accentBox },
    LayoutCard: { className: styles.layoutCard },
    Button: {
      elementType: "span",
      className: styles.button,
      size: props.size,
      color: props.color === "default" ? undefined : props.color,
      isDisabled: props.isDisabled,
      /**
       * Wrapping icon and text in one `Text` would collapse them into a single
       * flex item and drop the button's gap between them.
       */
      children: dynamic((buttonProps) => (
        <>
          <Wrap
            if={extractTextFromFirstChild(buttonProps.children) !== undefined}
          >
            <Text>{buttonProps.children}</Text>
          </Wrap>
          <LinkIcon download={download} target={target} unstyled={unstyled} />
        </>
      )),
    },
  };

  const unsupportedTypingsLinkProps = ariaCurrent
    ? ({
        "aria-current": true,
      } as Record<string, unknown>)
    : {};

  return (
    <Link
      {...unsupportedTypingsLinkProps}
      {...rest}
      target={target}
      download={download}
      onClickCapture={handleClickCapture}
      className={rootClassName}
      ref={ref}
      style={{ ...style, whiteSpace }}
    >
      <PropsContextProvider props={propsContext}>
        {children}
        <LinkIcon
          withZeroWidthJoiner
          unstyled={unstyled}
          target={target}
          download={download}
        >
          <UiComponentTunnelExit id={"icon"} component={"Link"} />
        </LinkIcon>
      </PropsContextProvider>
    </Link>
  );
});

export default Link;
