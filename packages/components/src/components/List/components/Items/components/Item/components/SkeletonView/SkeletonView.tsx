import type { FC } from "react";
import React from "react";
import View from "~/components/List/components/Items/components/Item/components/View/View";
import HeadingView from "~/views/HeadingView";
import SkeletonTextView from "~/views/SkeletonTextView";
import TextView from "~/views/TextView";

export const SkeletonView: FC = () => {
  return (
    <View>
      <HeadingView>
        <SkeletonTextView width="200px" />
      </HeadingView>
      <TextView>
        <SkeletonTextView width="300px" />
      </TextView>
    </View>
  );
};
