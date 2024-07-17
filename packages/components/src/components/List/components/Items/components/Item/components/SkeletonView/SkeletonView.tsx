import { Skeleton } from "@/components/Skeleton";
import type { FC } from "react";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import View from "@/components/List/components/Items/components/Item/components/View/View";

export const SkeletonView: FC = () => (
  <View>
    <Heading>
      <Skeleton width="200px" />
    </Heading>
    <Text>
      <Skeleton width="300px" />
    </Text>
  </View>
);
