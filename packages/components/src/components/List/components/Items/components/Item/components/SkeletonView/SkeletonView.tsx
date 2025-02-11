import { Avatar } from "@/components/Avatar";
import { Heading } from "@/components/Heading";
import { ListItemView, useList } from "@/components/List";
import { Skeleton } from "@/components/Skeleton";
import SkeletonText from "@/components/SkeletonText";
import { Text } from "@/components/Text";
import type { FC } from "react";

export type SkeletonViewProps = never;

/** @flr-generate all */
export const SkeletonView: FC<SkeletonViewProps> = () => {
  const list = useList();

  const showTiles = list.viewMode === "tiles";

  return (
    <ListItemView>
      {showTiles && (
        <Avatar>
          <Skeleton style={{ aspectRatio: 16 / 9 }} />
        </Avatar>
      )}
      <Heading>
        <SkeletonText width="200px" />
      </Heading>
      <Text>
        <SkeletonText width="300px" />
      </Text>
    </ListItemView>
  );
};
