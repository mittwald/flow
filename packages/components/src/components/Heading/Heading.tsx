import { ComponentProps, createElement, FC, PropsWithChildren } from "react";
import styles from "./Heading.module.scss";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface HeadingProps
  extends PropsWithChildren<
    ComponentProps<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">
  > {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Heading: FC<HeadingProps> = (props) => {
  const {
    children,
    className,
    level = 3,
    ...rest
  } = useProps("Heading", props);

  const rootClassName = clsx(styles.heading, className);

  return createElement(`h${level}`, {
    ...rest,
    className: rootClassName,
    children,
  });
};

export default Heading;
