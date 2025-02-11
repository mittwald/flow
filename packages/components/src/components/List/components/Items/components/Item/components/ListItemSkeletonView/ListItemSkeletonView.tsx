import type { ListViewMode } from "@/components/List/model/types";
import AvatarView from "@/views/AvatarView";
import FragmentView from "@/views/FragmentView";
import HeadingView from "@/views/HeadingView";
import ListItemViewContentView from "@/views/ListItemViewContentView";
import SkeletonTextView from "@/views/SkeletonTextView";
import SkeletonView from "@/views/SkeletonView";
import TextView from "@/views/TextView";
import type { FC } from "react";

export interface ListItemSkeletonViewProps {
  viewMode: ListViewMode;
}

export const ListItemSkeletonView: FC<ListItemSkeletonViewProps> = (props) => {
  const { viewMode } = props;

  const showTiles = viewMode === "tiles";

  return (
    <ListItemViewContentView
      viewMode={viewMode}
      title={
        <FragmentView>
          <HeadingView>
            <SkeletonTextView width="200px" />
          </HeadingView>
        </FragmentView>
      }
      avatar={
        showTiles && (
          <FragmentView>
            <AvatarView>
              <SkeletonView style={{ aspectRatio: 16 / 9 }} />
            </AvatarView>
          </FragmentView>
        )
      }
      subTitle={
        <FragmentView>
          <TextView>
            <SkeletonTextView width="300px" />
          </TextView>
        </FragmentView>
      }
    />
  );
};
