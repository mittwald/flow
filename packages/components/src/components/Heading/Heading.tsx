import { createElement, FC, HTMLAttributes, PropsWithChildren } from "react";
import styles from "./Heading.module.css";
import clsx from "clsx";
import { useProps } from "@/lib/propsContext";

export interface HeadingProps
  extends PropsWithChildren<HTMLAttributes<HTMLHeadingElement>> {
  level?: number;
}

export const Heading: FC<HeadingProps> = (props) => {
  const {
    children,
    className,
    level = 3,
    ...rest
  } = useProps("heading", props);

  const rootClassName = clsx(className, styles.root);

  return createElement(`h${level}`, {
    ...rest,
    className: rootClassName,
    children,
  });
};

export default Heading;
