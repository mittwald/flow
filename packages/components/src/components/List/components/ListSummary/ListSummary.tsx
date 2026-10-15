import type { PropsWithChildren } from "react";
import styles from "./ListSummary.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";
import clsx from "clsx";
import type { PropsWithClassName } from "@/lib/types/props";

export interface ListSummaryProps
  extends PropsWithClassName, FlowComponentProps, PropsWithChildren {
  /** Whether the summary is placed above or underneath the list @default "top" */
  position?: "top" | "bottom";
}

/** @flr-generate all */
export const ListSummary = flowComponent("ListSummary", (props) => {
  const { position = "top", className, ...rest } = props;

  if (position === "bottom") {
    return (
      <footer
        {...rest}
        className={clsx(styles.listSummary, styles.bottom, className)}
      />
    );
  }

  return (
    <header
      {...rest}
      className={clsx(styles.listSummary, styles.top, className)}
    />
  );
});

export default ListSummary;
