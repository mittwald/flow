import React, { FC, PropsWithChildren } from "react";
import styles from "./Text.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface TextProps
  extends PropsWithChildren<Omit<Aria.TextProps, "children">> {}

export const Text: FC<TextProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(className, styles.root);

  if (!props.slot) {
    return (
      <span {...rest} className={rootClassName}>
        {children}
      </span>
    );
  }

  return (
    <Aria.Text {...rest} className={rootClassName}>
      {children}
    </Aria.Text>
  );
};

export default Text;
