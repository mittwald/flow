import DivView from "@/views/DivView";
import type { FC, ReactNode } from "react";
import styles from "../../components/Items/Items.module.scss";
import type { EmptyViewType } from "../../model/types";
import { EmptySearchResultView } from "../../components/EmptySearchResultView";
import { EmptyView } from "../../components/EmptyView";

export interface EmptyViewContainerProps {
  emptyView?: ReactNode;
  emptySearchResultView?: ReactNode;
  viewType: EmptyViewType;
}

/** @flr-generate all */
export const EmptyViewContainer: FC<EmptyViewContainerProps> = (props) => {
  const emptyView = props.emptyView ?? <EmptyView />;
  const emptySearchResultView = props.emptySearchResultView ?? (
    <EmptySearchResultView />
  );
  return (
    <DivView className={styles.emptyView}>
      {props.viewType === "search" ? emptySearchResultView : emptyView}
    </DivView>
  );
};
