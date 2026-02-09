import type { FC, PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./Truncate.module.scss";
import type { TruncateProps as ReactTruncateProps } from "react-truncate-inside";
import ReactTruncate from "react-truncate-inside";
import { extractTextFromFirstChild } from "@/lib/react/remote";

export interface TruncateProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    Omit<ReactTruncateProps, "text"> {
  title?: string;
}

/** @flr-generate all */
export const Truncate: FC<TruncateProps> = (props) => {
  const { children, className, title, offset, ellipsis } = props;

  const rootClassName = clsx(styles.truncate, className);

  if (offset || ellipsis) {
    const text = extractTextFromFirstChild(children) ?? "";

    return (
      <span title={title} className={rootClassName}>
        <ReactTruncate offset={offset} ellipsis={ellipsis} text={text} />
      </span>
    );
  }

  return (
    <span title={title} className={clsx(rootClassName, styles.ellipsis)}>
      {children}
    </span>
  );
};

export default Truncate;
