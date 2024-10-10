import type { FC, PropsWithChildren } from "react";
import React from "react";
import styles from "./ListSummary.module.scss";
import type { FlowComponentProps } from "@/lib/componentFactory/flowComponent";
import { flowComponent } from "@/lib/componentFactory/flowComponent";

export interface ListSummaryProps
  extends FlowComponentProps,
    PropsWithChildren {}

export const ListSummary: FC<ListSummaryProps> = flowComponent(
  "ListSummary",
  (props) => {
    const { children } = props;

    return (
      <div className={styles.listSummary} {...props}>
        {children}
      </div>
    );
  },
);

export default ListSummary;
