import React, { ComponentProps, ComponentType, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import { ClearPropsContext } from "@/lib/propsContext";
import styles from "./Link.module.scss";
import clsx from "clsx";
import {
  flowComponent,
  FlowComponentProps,
} from "@/lib/componentFactory/flowComponent";
import { PropsWithClassName } from "@/lib/types/props";

export interface LinkProps
  extends PropsWithChildren<
      Omit<Aria.LinkProps, "children" | "slot" | "className">
    >,
    FlowComponentProps,
    PropsWithClassName {
  /** @default "default" */
  variant?: "default" | "danger";
  inline?: boolean;
  linkComponent?: ComponentType<Omit<ComponentProps<"a">, "ref">>;
  unstyled?: boolean;
}

export const Link = flowComponent("Link", (props) => {
  const {
    children,
    className,
    variant = "default",
    inline,
    linkComponent: Link = Aria.Link,
    unstyled = false,
    ...rest
  } = props;

  const rootClassName = unstyled
    ? className
    : clsx(styles.link, styles[variant], inline && styles.inline, className);

  return (
    <ClearPropsContext>
      <Link className={rootClassName} {...rest}>
        {children}
      </Link>
    </ClearPropsContext>
  );
});

export default Link;
