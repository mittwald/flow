import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import type { FC, PropsWithChildren } from "react";
import styles from "./Legend.module.scss";

export type LegendProps = PropsWithChildren & PropsWithClassName;

/** @flr-generate all */
export const Legend: FC<LegendProps> = (props) => {
  const { children, className, ...rest } = props;

  const rootClassName = clsx(styles.legend, className);

  return (
    <ul className={rootClassName} {...rest}>
      {children}
    </ul>
  );
};

export default Legend;
