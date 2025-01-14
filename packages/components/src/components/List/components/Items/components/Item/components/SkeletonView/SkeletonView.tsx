import type { FC } from "react";
import React from "react";
import { Heading } from "~/components/Heading";
import { Text } from "~/components/Text";
import ListItemView from "~/components/List/components/Items/components/Item/components/ListItemView/ListItemView";
import SkeletonText from "~/components/SkeletonText";

export const SkeletonView: FC = () => (
  <ListItemView>
    <Heading>
      <SkeletonText width="200px" />
    </Heading>
    <Text>
      <SkeletonText width="300px" />
    </Text>
  </ListItemView>
);
