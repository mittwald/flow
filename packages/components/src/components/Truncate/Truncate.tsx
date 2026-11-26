import type { PropsWithChildren } from "react";
import type { PropsWithClassName } from "@/lib/types/props";
import clsx from "clsx";
import styles from "./Truncate.module.scss";
import type { TruncateProps as ReactTruncateProps } from "react-truncate-inside";
import ReactTruncate from "react-truncate-inside";
import { extractTextFromFirstChild } from "@/lib/react/remote";
import { useIsSSR } from "react-aria";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface TruncateProps
  extends
    PropsWithChildren,
    PropsWithClassName,
    FlowComponentProps<HTMLSpanElement>,
    Omit<ReactTruncateProps, "text" | "width"> {
  /**
   * The `title` attribute of the elements root, which browsers show as a native
   * tooltip on hover. It is not derived from the children — pass the full text
   * to make it readable while truncated.
   */
  title?: string;
}

/** @flr-generate all */
export const Truncate = flowComponent(
  "Truncate",
  (props) => {
    const { children, className, title, offset, ellipsis, ref } = props;

    const rootClassName = clsx(styles.truncate, className);

    const isSsr = useIsSSR();

    if (!isSsr && (offset || ellipsis)) {
      const text = extractTextFromFirstChild(children) ?? "";

      return (
        <span ref={ref} title={title} className={rootClassName}>
          <ReactTruncate offset={offset} ellipsis={ellipsis} text={text} />
        </span>
      );
    }

    return (
      <span
        ref={ref}
        title={title}
        className={clsx(rootClassName, styles.ellipsis)}
      >
        {children}
      </span>
    );
  },
  /* Outer props contexts (e.g. the content color of `AccentBox`) keep reaching
     consumer children such as `Text`. */
  { type: "layout" },
);

export default Truncate;
