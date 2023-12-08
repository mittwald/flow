import React, { FC, PropsWithChildren } from "react";
import styles from "./Label.module.css";
import * as Aria from "react-aria-components";
import clsx from "clsx";

export interface LabelProps
  extends PropsWithChildren<Omit<Aria.LabelProps, "children">> {}

export const Label: FC<LabelProps> = (props) => {
  const { children, ...rest } = props;

  const className = clsx(props.className, styles.root);

  return (
    <Aria.Label {...rest} className={className}>
      {children}
    </Aria.Label>
  );
};

export default Label;
