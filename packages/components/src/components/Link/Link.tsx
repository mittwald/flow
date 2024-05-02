import type { ComponentProps, ComponentType, PropsWithChildren } from "react";
import React, { useContext } from "react";
import * as Aria from "react-aria-components";
import type { PropsContext } from "@/lib/propsContext";
import { ClearPropsContext, PropsContextProvider } from "@/lib/propsContext";
import styles from "./Link.module.scss";
import clsx from "clsx";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import type { PropsWithClassName } from "@/lib/types/props";
import { linkContext } from "@/components/Link/context";

export interface LinkProps
  extends PropsWithChildren<
      Omit<Aria.LinkProps, "children" | "slot" | "className">
    >,
    FlowComponentProps<"Link">,
    PropsWithClassName {
  inline?: boolean;
  linkComponent?: ComponentType<Omit<ComponentProps<"a">, "ref">>;
  /** @internal */
  unstyled?: boolean;
  "aria-current"?: string;
}

export const Link = flowComponent("Link", (props) => {
  const {
    children,
    className,
    inline,
    linkComponent: linkComponentFromProps,
    unstyled = false,
    "aria-current": ariaCurrent,
    ref,
    ...rest
  } = props;

  const { linkComponent: linkComponentFromContext } = useContext(linkContext);
  const Link = linkComponentFromProps ?? linkComponentFromContext ?? Aria.Link;

  const rootClassName = unstyled
    ? className
    : clsx(styles.link, inline && styles.inline, className);

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
      size: "s",
    },
  };

  const unsupportedTypingsLinkProps = {
    "aria-current": ariaCurrent,
  } as Record<string, unknown>;

  return (
    <ClearPropsContext>
      <Link
        {...rest}
        {...unsupportedTypingsLinkProps}
        className={rootClassName}
        ref={ref}
      >
        <PropsContextProvider props={propsContext}>
          {children}
        </PropsContextProvider>
      </Link>
    </ClearPropsContext>
  );
});

export default Link;
