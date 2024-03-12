import React, { ComponentPropsWithoutRef, FC, PropsWithChildren } from "react";
import styles from "./Heading.module.scss";
import clsx from "clsx";
import {
  PropsContext,
  PropsContextProvider,
  useProps,
} from "@/lib/propsContext";

type Level = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps
  extends PropsWithChildren,
    ComponentPropsWithoutRef<"h1" | "h2" | "h3" | "h4" | "h5" | "h6"> {
  level?: Level;
}

export const Heading: FC<HeadingProps> = (props) => {
  const {
    children,
    className,
    level = 2,
    ...rest
  } = useProps("Heading", props);

  const rootClassName = clsx(styles.heading, className);

  const Element: `h${Level}` = `h${level}`;

  const propsContext: PropsContext = {
    Icon: {
      "aria-hidden": true,
      size: "s",
      className: styles.icon,
    },
  };

  return (
    <Element className={rootClassName} {...rest}>
      <PropsContextProvider props={propsContext}>
        {children}
      </PropsContextProvider>
    </Element>
  );
};

export default Heading;
