import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";
import styles from "./Link.module.scss";
import clsx from "clsx";

export interface LinkProps
  extends PropsWithChildren<Omit<Aria.LinkProps, "children">> {
  /** @default "default" */
  variant?: "default" | "danger";
}

export const Link: FC<LinkProps> = (props) => {
  const {
    children,
    className,
    variant = "default",
    ...rest
  } = useProps("Link", props);

  const rootClassName = clsx(styles.link, styles[variant], className);

  const propsContext: PropsContext = {
    Icon: {
      className: styles.icon,
      size: "s",
    },
  };

  return (
    <Aria.Link className={rootClassName} {...rest}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Aria.Link>
  );
};

export default Link;
