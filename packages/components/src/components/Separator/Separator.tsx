import type { FC } from "react";
import React from "react";
import clsx from "clsx";
import styles from "./Separator.module.scss";
import * as Aria from "react-aria-components";

export interface SeparatorProps
  extends Omit<Aria.SeparatorProps, "orientation"> {}

export const Separator: FC<SeparatorProps> = (props) => {
  const { className, ...rest } = props;

  const rootClassName = clsx(styles.separator, className);

  return (
    <Aria.Separator elementType="hr" className={rootClassName} {...rest} />
  );
};

export default Separator;
