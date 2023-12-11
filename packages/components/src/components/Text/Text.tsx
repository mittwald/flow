import React, { createElement, FC, PropsWithChildren } from "react";
import styles from "./Text.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface TextProps
  extends PropsWithChildren<Omit<Aria.TextProps, "children">> {}

export const Text: FC<TextProps> = (props) => {
  const { children, className, elementType, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  return createElement(props.slot ? Aria.Text : elementType ?? "span", {
    ...rest,
    className: rootClassName,
    elementType,
    children,
  });
};

export default Text;
