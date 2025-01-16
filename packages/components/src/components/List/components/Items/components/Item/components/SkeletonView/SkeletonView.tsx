import type { FC } from "react";
import React from "react";
import { Heading } from "~/components/Heading";
import { Text } from "~/components/Text";
import View from "~/components/List/components/Items/components/Item/components/View/View";
import SkeletonText from "~/components/SkeletonText";
import { useViewComponents } from "~/lib/viewComponentContext/useViewComponent";

export const SkeletonView: FC = () => {
  const { HeadingView, SkeletonTextView, TextView } = useViewComponents(
    ["Heading", Heading],
    ["SkeletonText", SkeletonText],
    ["Text", Text],
  );

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
