import React, { FC, PropsWithChildren } from "react";
import * as Aria from "react-aria-components";
import { useProps } from "@/lib/propsContext";
import styles from "./Link.module.css";
import clsx from "clsx";

export interface LinkProps
  extends PropsWithChildren<Omit<Aria.LinkProps, "children">> {
  /** @default "default" */
  variant: "default" | "negative";
}

export const Link: FC<LinkProps> = (props) => {
  const {
    children,
    className,
    variant = "default",
    ...rest
  } = useProps("link", props);

  const rootClassName = clsx(className, styles.root, styles[variant]);

  return (
    <Aria.Link className={rootClassName} {...rest}>
      {children}
    </Aria.Link>
  );
};

export default Link;
