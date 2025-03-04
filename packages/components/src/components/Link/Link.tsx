import { LinkIcon } from "@/components/Link/components/LinkIcon";
import { linkContext } from "@/components/Link/context";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsContext } from "@/lib/propsContext";
import { PropsContextProvider } from "@/lib/propsContext";
import type { PropsWithClassName } from "@/lib/types/props";
import ClearPropsContextView from "@/views/ClearPropsContextView";
import clsx from "clsx";
import type { ComponentProps, ComponentType, PropsWithChildren } from "react";
import { useContext } from "react";
import * as Aria from "react-aria-components";
import styles from "./Link.module.scss";

export interface LinkProps
  extends PropsWithChildren<
      Omit<Aria.LinkProps, "children" | "slot" | "className">
    >,
    FlowComponentProps,
    PropsWithClassName {
  /** Whether the link should be styled for being displayed inside a text. */
  inline?: boolean;
  /** An alternative link component. */
  linkComponent?: ComponentType<Omit<ComponentProps<"a">, "ref">>;
  /** The color of the link. @default "primary" */
  color?: "primary" | "dark" | "light";
  "aria-current"?: string;
  slot?: string;
  /** @internal */
  unstyled?: boolean;
}

/** @flr-generate all */
export const Link = flowComponent<"Link", HTMLAnchorElement>(
  "Link",
  (props) => {
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
      ...rest
    } = props;

    const { linkComponent: linkComponentFromContext } = useContext(linkContext);
    const Link = linkComponentFromProps
      ? linkComponentFromProps
      : props.href && linkComponentFromContext
        ? linkComponentFromContext
        : Aria.Link;

    const rootClassName = unstyled
      ? className
      : clsx(styles.link, inline && styles.inline, styles[color], className);

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
      <ClearPropsContextView>
        <Link
          {...unsupportedTypingsLinkProps}
          {...rest}
          className={rootClassName}
          ref={ref}
        >
          <PropsContextProvider props={propsContext}>
            {children}
            <LinkIcon {...props} />
          </PropsContextProvider>
        </Link>
      </ClearPropsContextView>
    );
  },
);

export default Link;
