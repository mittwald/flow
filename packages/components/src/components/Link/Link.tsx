import React, {
  ComponentProps,
  ComponentType,
  FC,
  PropsWithChildren,
} from "react";
import * as Aria from "react-aria-components";
import { useProps } from "@/lib/propsContext";
import styles from "./Link.module.scss";
import clsx from "clsx";

export interface LinkProps
  extends PropsWithChildren<Omit<Aria.LinkProps, "children">> {
  /** @default "default" */
  variant?: "default" | "danger";
  inline?: boolean;
  linkComponent?: ComponentType<Omit<ComponentProps<"a">, "ref">>;
}

export const Link: FC<LinkProps> = (props) => {
  const {
    children,
    className,
    variant = "default",
    inline,
    ...rest
  } = useProps("Link", props);

  const rootClassName = clsx(
    styles.link,
    styles[variant],
    inline && styles.inline,
    className,
  );

  return (
    <Aria.Link className={rootClassName} {...rest}>
      {children}
    </Aria.Link>
  );
};

export default Link;
