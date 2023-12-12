import React, { FC, PropsWithChildren } from "react";
import styles from "./Text.module.css";
import * as Aria from "react-aria-components";
import useProps from "@/lib/propsContext/useProps";
import clsx from "clsx";

export interface TextProps extends PropsWithChildren<Aria.TextProps> {}

export const Text: FC<TextProps> = (props) => {
  const {
    children,
    className: classNameFromProps,
    ...restProps
  } = useProps("text", props);

  const className = clsx(classNameFromProps, styles.root);

  return (
    <Aria.Text className={className} {...restProps}>
      {children}
    </Aria.Text>
  );
};

export default Text;
