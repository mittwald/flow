import type { FC } from "react";
import React from "react";
import ListItemView from "~/components/List/components/ListItemView/ListItemView";
import HeadingView from "~/views/HeadingView";
import SkeletonTextView from "~/views/SkeletonTextView";
import TextView from "~/views/TextView";

export const SkeletonView: FC = () => {
  return (
    <ListItemView>
      <HeadingView>
        <SkeletonTextView width="200px" />
      </HeadingView>
      <TextView>
        <SkeletonTextView width="300px" />
      </TextView>
    </ListItemView>
  );
};
