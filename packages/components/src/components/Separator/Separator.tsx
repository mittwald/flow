import type { FC } from "react";
import React from "react";
import clsx from "clsx";
import styles from "./Separator.module.scss";
import * as Aria from "react-aria-components";

export type SeparatorProps = Aria.SeparatorProps;

/** @flr-generate all */
export const Separator: FC<SeparatorProps> = (props) => {
  const { className, orientation = "horizontal", ...rest } = props;

  const rootClassName = clsx(
    styles.separator,
    orientation === "vertical" && styles.vertical,
    className,
  );

  return (
    <Aria.Separator elementType="hr" className={rootClassName} {...rest} />
  );
};

export default Separator;
