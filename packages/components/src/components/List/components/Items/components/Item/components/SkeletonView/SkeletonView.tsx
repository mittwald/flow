import type { FC } from "react";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import SkeletonText from "@/components/SkeletonText";
import { ListItemView, useList } from "@/components/List";
import { Skeleton } from "@/components/Skeleton";
import { Avatar } from "@/components/Avatar";

export const SkeletonView: FC = () => {
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
