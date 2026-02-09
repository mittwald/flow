import type { FC, PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./Truncate.module.scss";

export interface TruncateProps extends PropsWithChildren, PropsWithClassName {
  title?: string;
}

/** @flr-generate all */
export const Truncate: FC<TruncateProps> = (props) => {
  const { children, className, title } = props;

  const rootClassName = clsx(styles.truncate, className);

  return (
    <span title={title} className={rootClassName}>
      {children}
    </span>
  );
};

export default Truncate;
