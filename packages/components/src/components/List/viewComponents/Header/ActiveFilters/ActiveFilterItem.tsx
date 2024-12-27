import type { FC, PropsWithChildren } from "react";
import React from "react";
import { Text } from "@/components/Text";
import { Badge } from "@/components/Badge";

interface Props extends PropsWithChildren {
  onRemove?: () => void;
}

export const ActiveFilterItem: FC<Props> = (props) => {
  const { children, onRemove } = props;
  return (
    <Badge onClose={onRemove}>
      <Text>{children}</Text>
    </Badge>
  );
};

export default ActiveFilterItem;
