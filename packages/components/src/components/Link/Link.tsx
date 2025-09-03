import type {
  ComponentProps,
  ComponentType,
  CSSProperties,
  PropsWithChildren,
} from "react";
import { useContext } from "react";
import * as Aria from "react-aria-components";
import type { PropsContext } from "@/lib/propsContext";
import ClearPropsContext from "@/components/ClearPropsContext/ClearPropsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import styles from "./Link.module.scss";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { linkContext } from "@/components/Link/context";
import { LinkIcon } from "@/components/Link/components/LinkIcon";

export interface LinkProps
  extends PropsWithChildren<
      Omit<Aria.LinkProps, "children" | "slot" | "className">
    >,
    FlowComponentProps<HTMLAnchorElement>,
    PropsWithClassName {
  /** Whether the link should be styled for being displayed inside a text. */
  inline?: boolean;
  /** An alternative link component. */
  linkComponent?: ComponentType<Omit<ComponentProps<"a">, "ref">>;
  /** The color of the link. @default "primary" */
  color?: "primary" | "dark" | "light";
  "aria-current"?: string;
  slot?: string;
  /** The whiteSpace css value of the element. */
  whiteSpace?: CSSProperties["whiteSpace"];
  /** @internal */
  unstyled?: boolean;
}

/**
 * @flr-generate all
 * @flr-clear-props-context
 */
export const Link = flowComponent("Link", (props) => {
  const {
    children,
    className,
    inline,
    linkComponent: linkComponentFromProps,
    color = "primary",
    unstyled = false,
    "aria-current": ariaCurrent,
    ref,
    slot: ignoredSlotProp,
    style,
    whiteSpace,
    ...rest
  } = props;

  const { linkComponent: linkComponentFromContext } = useContext(linkContext);
  const Link = linkComponentFromProps
    ? (linkComponentFromProps as typeof Aria.Link)
    : props.href && linkComponentFromContext
      ? (linkComponentFromContext as typeof Aria.Link)
      : Aria.Link;

  const rootClassName = unstyled
    ? className
    : clsx(
        styles.link,
        inline && styles.inline,
        styles[color as keyof typeof styles],
        className,
      );

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
      size: "s",
    },
  };

  const unsupportedTypingsLinkProps = ariaCurrent
    ? ({
        "aria-current": true,
      } as Record<string, unknown>)
    : {};

  return (
    <ClearPropsContext>
      <Link
        {...unsupportedTypingsLinkProps}
        {...rest}
        className={rootClassName}
        ref={ref}
        style={{ ...style, whiteSpace }}
      >
        <PropsContextProvider props={propsContext}>
          {children}
          <LinkIcon {...props} />
        </PropsContextProvider>
      </Link>
    </ClearPropsContext>
  );
});

export default Link;
