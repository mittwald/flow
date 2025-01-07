import type { FC } from "react";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import View from "@/components/List/components/Items/components/Item/components/View/View";
import SkeletonText from "@/components/SkeletonText";
import { useList } from "@/components/List";
import { Skeleton } from "@/components/Skeleton";

export const SkeletonView: FC = () => {
  const list = useList();

  return (
    <View>
      {list.tile && <Skeleton height="200px" />}
      <Heading>
        <SkeletonText width="200px" />
      </Heading>
      <Text>
        <SkeletonText width="300px" />
      </Text>
    </View>
  );
};
