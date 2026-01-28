import type { PropsWithChildren } from "react";
import React from "react";
import styles from "./ListSummary.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import clsx from "clsx";

export interface ListSummaryProps
  extends FlowComponentProps, PropsWithChildren {
  /** Whether the summary is placed above or underneath the list @default: "top" */
  position?: "top" | "bottom";
}

/** @flr-generate all */
export const ListSummary = flowComponent("ListSummary", (props) => {
  const { children, position = "top", ref } = props;

  if (position === "bottom") {
    return (
      <footer
        ref={ref}
        className={clsx(styles.listSummary, styles.bottom)}
        {...props}
      >
        {children}
      </footer>
    );
  }

  return (
    <header
      ref={ref}
      className={clsx(styles.listSummary, styles.top)}
      {...props}
    >
      {children}
    </header>
  );
});

export default ListSummary;
